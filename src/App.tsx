import React, { useState, useEffect } from 'react';
import { ToastProvider, useToast } from './components/Toast';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { DashboardView } from './components/DashboardView';
import { ClientsView } from './components/ClientsView';
import { RemindersView } from './components/RemindersView';
import { WhatsAppView } from './components/WhatsAppView';
import { MessageLogsView } from './components/MessageLogsView';
import { SettingsView } from './components/SettingsView';
import { ClientModal } from './components/ClientModal';
import { ClientDetailDrawer } from './components/ClientDetailDrawer';
import { StorageService } from './services/storage';
import { Client, Reminder, MessageLog, SalonSettings, DashboardMetrics } from './types';

function SalonAppContent() {
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [clients, setClients] = useState<Client[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [logs, setLogs] = useState<MessageLog[]>([]);
  const [settings, setSettings] = useState<SalonSettings>(StorageService.getSettings());
  const [metrics, setMetrics] = useState<DashboardMetrics>(StorageService.getDashboardMetrics());

  const [selectedClientForDrawer, setSelectedClientForDrawer] = useState<Client | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentBranch, setCurrentBranch] = useState('Madison Ave Flagship · New York');
  const [searchQuery, setSearchQuery] = useState('');

  // Reload data from storage
  const refreshAllData = () => {
    const loadedClients = StorageService.getClients();
    const loadedReminders = StorageService.getReminders();
    const loadedLogs = StorageService.getMessageLogs();
    const loadedSettings = StorageService.getSettings();
    const loadedMetrics = StorageService.getDashboardMetrics();

    setClients(loadedClients);
    setReminders(loadedReminders);
    setLogs(loadedLogs);
    setSettings(loadedSettings);
    setMetrics(loadedMetrics);

    // If client drawer is open, keep selected client in sync
    if (selectedClientForDrawer) {
      const refreshed = loadedClients.find((c) => c.id === selectedClientForDrawer.id);
      if (refreshed) setSelectedClientForDrawer(refreshed);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  // Save / Update client
  const handleSaveClient = (clientData: Partial<Client> & { fullName: string; phone: string }) => {
    const saved = StorageService.saveClient(clientData);
    refreshAllData();
    showToast(
      clientData.id ? 'Guest Profile Updated' : 'Guest Registered',
      `${saved.fullName} is now active in the ${saved.vipTier} tier.`,
      'success'
    );
  };

  // Simulate single WhatsApp reminder send
  const handleSimulateSend = (reminderId: string) => {
    try {
      const result = StorageService.simulateSendReminder(reminderId);
      refreshAllData();
      showToast(
        'WhatsApp Cadence Dispatched',
        `Simulated message sent to ${result.log.clientName} (${result.log.phone}). Blue checkmarks active.`,
        'success'
      );
    } catch (e: any) {
      showToast('Dispatch Error', e.message, 'error');
    }
  };

  // Simulate Batch WhatsApp send
  const handleSimulateBatch = () => {
    const dueReminders = reminders.filter((r) => r.status === 'queued' || r.status === 'scheduled');
    dueReminders.forEach((r) => {
      try {
        StorageService.simulateSendReminder(r.id);
      } catch (err) {
        console.error(err);
      }
    });
    refreshAllData();
    showToast(
      'Batch Cadence Dispatched',
      `Sent ${dueReminders.length} automated revisit messages via WhatsApp simulation.`,
      'success'
    );
  };

  // Reschedule reminder
  const handleReschedule = (reminderId: string, newDate: string) => {
    StorageService.rescheduleReminder(reminderId, newDate);
    refreshAllData();
    showToast('Cadence Rescheduled', `Target revisit date moved to ${newDate}.`, 'info');
  };

  // Snooze reminder
  const handleSnooze = (reminderId: string) => {
    StorageService.snoozeReminder(reminderId, 7);
    refreshAllData();
    showToast('Cadence Snoozed', 'Follow-up postponed by 7 days.', 'info');
  };

  // Mark appointment confirmed / rebooked
  const handleMarkConfirmed = (reminderId: string) => {
    StorageService.updateReminderStatus(reminderId, 'confirmed', {
      respondedAt: new Date().toISOString(),
      revisitDateScheduled: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    });
    refreshAllData();
    showToast('Appointment Confirmed', 'Guest marked as rebooked and scheduled.', 'success');
  };

  // Retry failed message
  const handleRetryMessage = (logId: string) => {
    try {
      StorageService.retryFailedMessage(logId);
      refreshAllData();
      showToast('Message Re-dispatched', 'Simulated delivery recovered successfully.', 'success');
    } catch (e: any) {
      showToast('Retry Failed', e.message, 'error');
    }
  };

  // Simulate Inbound Client Reply
  const handleSimulateGuestReply = (replyText: string) => {
    const logsList = StorageService.getMessageLogs();
    const latestSent = logsList.find((l) => l.status === 'read' || l.status === 'delivered') || logsList[0];
    if (latestSent) {
      StorageService.simulateGuestReply(latestSent.id, replyText);
      refreshAllData();
      showToast(
        'Inbound Reply Received',
        `${latestSent.clientName}: "${replyText}"`,
        'success'
      );
    }
  };

  // Save Settings
  const handleSaveSettings = (newSettings: Partial<SalonSettings>) => {
    const updated = StorageService.saveSettings(newSettings);
    setSettings(updated);
    refreshAllData();
    showToast('Settings Saved', 'Atelier profile and cadence rules updated.', 'success');
  };

  // Reset to initial luxury set
  const handleResetData = () => {
    StorageService.resetToDefaultData();
    refreshAllData();
    showToast('Atelier Data Restored', 'Curated luxury salon clientele and cadence logs reloaded.', 'info');
  };

  // When global search is typed, if user is not in 'clients', switch to it
  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    if (q.trim() && activeTab !== 'clients') {
      setActiveTab('clients');
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF7F1] flex text-[#29252A]">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        dueCount={metrics.dueRemindersCount}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        currentBranch={currentBranch}
        onSwitchBranch={(b) => {
          setCurrentBranch(b);
          showToast('Branch Active', `Switched view to ${b}`, 'info');
        }}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        {/* Top Header */}
        <TopHeader
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          activeTab={activeTab}
          onOpenRegisterModal={() => {
            setEditingClient(null);
            setIsRegisterModalOpen(true);
          }}
          searchQuery={searchQuery}
          setSearchQuery={handleSearchChange}
          isSimulationMode={settings.isSimulationMode}
        />

        {/* Viewport Content */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              metrics={metrics}
              clients={clients}
              reminders={reminders}
              salonName={settings.salonName}
              onNavigate={(tab) => setActiveTab(tab)}
              onSelectClient={(client) => setSelectedClientForDrawer(client)}
              onSimulateSend={handleSimulateSend}
            />
          )}

          {activeTab === 'clients' && (
            <ClientsView
              clients={clients}
              onSelectClient={(client) => setSelectedClientForDrawer(client)}
              onEditClient={(client) => {
                setEditingClient(client);
                setIsRegisterModalOpen(true);
              }}
              onSendReminder={(client) => {
                const rem = reminders.find((r) => r.clientId === client.id);
                if (rem) {
                  handleSimulateSend(rem.id);
                } else {
                  const newRem = StorageService.createReminderForClient(client);
                  refreshAllData();
                  handleSimulateSend(newRem.id);
                }
              }}
              onOpenRegisterModal={() => {
                setEditingClient(null);
                setIsRegisterModalOpen(true);
              }}
            />
          )}

          {activeTab === 'reminders' && (
            <RemindersView
              reminders={reminders}
              onSimulateSend={handleSimulateSend}
              onReschedule={handleReschedule}
              onSnooze={handleSnooze}
              onMarkConfirmed={handleMarkConfirmed}
              onSimulateBatch={handleSimulateBatch}
            />
          )}

          {activeTab === 'whatsapp' && (
            <WhatsAppView
              settings={settings}
              onSaveSettings={handleSaveSettings}
              onSimulateGuestReply={handleSimulateGuestReply}
            />
          )}

          {activeTab === 'logs' && (
            <MessageLogsView
              logs={logs}
              onRetryMessage={handleRetryMessage}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              settings={settings}
              clients={clients}
              onSaveSettings={handleSaveSettings}
              onResetData={handleResetData}
            />
          )}
        </main>
      </div>

      {/* Guest Folio Side Drawer */}
      <ClientDetailDrawer
        client={selectedClientForDrawer}
        isOpen={Boolean(selectedClientForDrawer)}
        onClose={() => setSelectedClientForDrawer(null)}
        onEdit={(client) => {
          setSelectedClientForDrawer(null);
          setEditingClient(client);
          setIsRegisterModalOpen(true);
        }}
        onSendReminder={(client) => {
          const rem = reminders.find((r) => r.clientId === client.id);
          if (rem) {
            handleSimulateSend(rem.id);
          } else {
            const newRem = StorageService.createReminderForClient(client);
            refreshAllData();
            handleSimulateSend(newRem.id);
          }
        }}
      />

      {/* Register / Edit Guest Modal */}
      <ClientModal
        isOpen={isRegisterModalOpen}
        onClose={() => {
          setIsRegisterModalOpen(false);
          setEditingClient(null);
        }}
        onSave={handleSaveClient}
        initialClient={editingClient}
        stylists={settings.staff}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <SalonAppContent />
    </ToastProvider>
  );
}

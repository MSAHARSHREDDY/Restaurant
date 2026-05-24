import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Save, 
  Plane, 
  Shield, 
  Percent, 
  Database, 
  HelpCircle, 
  Wrench, 
  ToggleLeft, 
  ToggleRight 
} from 'lucide-react';
import toast from 'react-hot-toast';

interface AppSettings {
  airlineCode: string;
  taxRatePercent: number;
  warningsEnabled: boolean;
  backupInterval: string;
  maintenanceMode: boolean;
  supportEmail: string;
}

const defaultSettings: AppSettings = {
  airlineCode: 'AI-201',
  taxRatePercent: 18,
  warningsEnabled: true,
  backupInterval: 'daily',
  maintenanceMode: false,
  supportEmail: 'steward-desk@kvrairways.com'
};

export function AdminSettings() {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('kvr_admin_settings');
    if (stored) {
      try {
        setSettings(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    } else {
      localStorage.setItem('kvr_admin_settings', JSON.stringify(defaultSettings));
    }
    setLoading(false);
  }, []);

  const handleToggleWarnings = () => {
    setSettings(prev => ({ ...prev, warningsEnabled: !prev.warningsEnabled }));
  };

  const handleToggleMaintenance = () => {
    setSettings(prev => ({ ...prev, maintenanceMode: !prev.maintenanceMode }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('kvr_admin_settings', JSON.stringify(settings));
    toast.success("Operational settings updated successfully.");
  };

  if (loading) return <div className="text-white p-8">Reading configuration systems...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-dark-900 to-dark-950 border border-white/10 rounded-2xl p-6 shadow-xl">
        <span className="text-gold-500 text-xs font-mono tracking-widest uppercase mb-1 block">Aviation Registry</span>
        <h3 className="text-3xl font-serif text-white flex items-center gap-2">
          <Settings className="w-8 h-8 text-gold-500" /> Administrative Settings
        </h3>
        <p className="text-gray-400 text-sm mt-1">Configure default flight paths, tax tables, support emails, and system operations.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Section: Aviation Defaults */}
          <div className="bg-dark-900 border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
            <h4 className="text-base font-serif text-white flex items-center gap-2 border-b border-white/5 pb-3">
              <Plane className="w-5 h-5 text-gold-500" /> Flight Defaults
            </h4>
            
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 font-bold mb-1.5 font-mono">Carrier Flight Code ID</label>
              <input 
                type="text" 
                value={settings.airlineCode}
                onChange={(e) => setSettings(prev => ({ ...prev, airlineCode: e.target.value }))}
                required
                className="w-full bg-dark-950 border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white focus:border-gold-500 outline-none uppercase font-mono tracking-widest"
              />
              <span className="text-[10px] text-gray-500 mt-1 block">Assigned to newly created passenger table bookings.</span>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-550 font-bold mb-1.5 font-mono">Assigned Support Desk Email</label>
              <input 
                type="email" 
                value={settings.supportEmail}
                onChange={(e) => setSettings(prev => ({ ...prev, supportEmail: e.target.value }))}
                required
                className="w-full bg-dark-950 border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white focus:border-gold-500 outline-none font-mono"
              />
            </div>
          </div>

          {/* Section: Pricing & Tax Table */}
          <div className="bg-dark-900 border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
            <h4 className="text-base font-serif text-white flex items-center gap-2 border-b border-white/5 pb-3">
              <Percent className="w-5 h-5 text-gold-500" /> Tax Brackets
            </h4>

            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 font-bold mb-1.5 font-mono">Cuisine GST / VAT (%)</label>
              <input 
                type="number" 
                value={settings.taxRatePercent}
                onChange={(e) => setSettings(prev => ({ ...prev, taxRatePercent: Number(e.target.value) }))}
                required
                min={0}
                max={50}
                className="w-full bg-dark-950 border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white focus:border-gold-500 outline-none font-mono font-bold"
              />
              <span className="text-[10px] text-gray-500 mt-1 block">In-flight tax added automatically at checkout.</span>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 font-bold mb-1.5 font-mono">Log Database Backups</label>
              <select
                value={settings.backupInterval}
                onChange={(e) => setSettings(prev => ({ ...prev, backupInterval: e.target.value }))}
                className="w-full bg-dark-950 border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white focus:border-gold-500 outline-none cursor-pointer"
              >
                <option value="hourly">Every Hour (Galley Stress-test)</option>
                <option value="daily">Daily Cron Backup</option>
                <option value="weekly">Weekly Safe Backup</option>
              </select>
            </div>
          </div>

          {/* Section: Warnings & System Toggles */}
          <div className="bg-dark-900 border border-white/10 rounded-2xl p-6 shadow-xl space-y-4 md:col-span-2">
            <h4 className="text-base font-serif text-white flex items-center gap-2 border-b border-white/5 pb-3">
              <Shield className="w-5 h-5 text-gold-500" /> Operational Policies
            </h4>

            <div className="divide-y divide-white/5">
              
              {/* Toggle 1 */}
              <div className="py-4 flex items-center justify-between">
                <div>
                  <span className="text-white font-medium text-sm block">Cabin Seating Warning Triggers</span>
                  <span className="text-xs text-gray-400">Trigger warnings if duplicate VIP seats are assigned by stewarding desks.</span>
                </div>
                <button
                  type="button"
                  onClick={handleToggleWarnings}
                  className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  {settings.warningsEnabled ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-emerald-400 font-bold font-mono">ACTIVE</span>
                      <ToggleRight className="w-10 h-10 text-emerald-500" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 font-bold font-mono">DISABLED</span>
                      <ToggleLeft className="w-10 h-10 text-gray-400" />
                    </div>
                  )}
                </button>
              </div>

              {/* Toggle 2 */}
              <div className="py-4 flex items-center justify-between">
                <div>
                  <span className="text-white font-medium text-sm block">Cabin Service Maintenance Toggle</span>
                  <span className="text-xs text-gray-400">Direct civilian traffic to a "galley closed for cleaning" placeholder during emergency routes.</span>
                </div>
                <button
                  type="button"
                  onClick={handleToggleMaintenance}
                  className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  {settings.maintenanceMode ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-rose-400 font-bold font-mono">GALLEY CLOSED</span>
                      <ToggleRight className="w-10 h-10 text-rose-500" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-550 font-bold font-mono">GALLEY OPEN</span>
                      <ToggleLeft className="w-10 h-10 text-gray-400" />
                    </div>
                  )}
                </button>
              </div>

            </div>
          </div>

        </div>

        {/* Action Save Bar */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="flex items-center gap-2 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-dark-950 font-bold px-6 py-3 rounded-xl transition-all shadow-lg cursor-pointer"
          >
            <Save className="w-5 h-5" />
            <span>Save Admin Configurations</span>
          </button>
        </div>
      </form>
    </div>
  );
}

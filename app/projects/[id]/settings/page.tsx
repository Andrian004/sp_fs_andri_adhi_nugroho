import { SettingsContent } from "./_components/setting-content";

export default function SettingsPage() {
  return (
    <div className="w-full h-full pt-16 px-4 pb-4 overflow-x-hidden bg-white">
      <h1 className="text-2xl font-bold py-2">Project Settings</h1>
      <p className="text-gray-600">Manage your project settings here.</p>
      <SettingsContent />
    </div>
  );
}

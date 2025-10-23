import React, { useState } from 'react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { useDataStore } from '../store/dataStore';
import Card from '../components/Card';
import Badge from '../components/Badge';
import { GRADE_SCALE } from '../lib/grade';

const Settings = () => {
  const { settings, updateSettings } = useDataStore();
  const [isSaving, setIsSaving] = useState(false);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: settings
  });

  const onSubmit = async (data) => {
    setIsSaving(true);
    try {
      updateSettings(data);
      toast.success('Settings updated');
    } catch {
      toast.error('Failed to update settings');
    } finally {
      setIsSaving(false);
    }
  };

  const resetToDefaultGradeScale = () => {
    updateSettings({ ...settings, gradeScale: GRADE_SCALE });
    toast.success('Grade scale reset to default');
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Configure application preferences</p>
      </div>

      <Card title="General">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
              <select {...register('theme')} className="input">
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button type="submit" disabled={isSaving} className="btn-primary">
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" onClick={() => reset(settings)} className="btn-secondary">Reset</button>
          </div>
        </form>
      </Card>

      <Card title="Grade Scale" titleActions={
        <button onClick={resetToDefaultGradeScale} className="btn-secondary">Reset to Default</button>
      }>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="text-left text-xs uppercase text-gray-500">
                <th className="px-4 py-2">Range</th>
                <th className="px-4 py-2">Letter</th>
                <th className="px-4 py-2">GPA</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {(settings.gradeScale || GRADE_SCALE).map((g, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-2 text-sm text-gray-700">{g.min} - {g.max}</td>
                  <td className="px-4 py-2"><Badge variant="primary" size="sm">{g.letter}</Badge></td>
                  <td className="px-4 py-2 text-sm text-gray-700">{g.gpa}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500 mt-3">Grade scale is currently read-only in this demo.</p>
      </Card>
    </div>
  );
};

export default Settings;

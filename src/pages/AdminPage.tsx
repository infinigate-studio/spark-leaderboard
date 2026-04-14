import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useLeaderboardData } from '../hooks/useLeaderboardData';
import { useAuth } from '../hooks/useAuth';
import type { Team, LeaderboardEntry } from '../lib/types';

export default function AdminPage() {
  const { accountManagers, salesTeams, loading } = useLeaderboardData();
  const { signOut } = useAuth();

  return (
    <div className="admin">
      <div className="admin__header">
        <h1 className="admin__title">
          Leaderboard Admin
        </h1>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Link to="/" className="btn btn--secondary">View Leaderboard</Link>
          <button className="btn btn--logout" onClick={signOut}>Sign Out</button>
        </div>
      </div>

      {loading ? (
        <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
      ) : (
        <div className="admin__teams">
          <TeamSection
            title="Account Managers"
            team="account_managers"
            entries={accountManagers}
          />
          <TeamSection
            title="Sales Teams"
            team="sales_teams"
            entries={salesTeams}
          />
        </div>
      )}
    </div>
  );
}

interface TeamSectionProps {
  title: string;
  team: Team;
  entries: LeaderboardEntry[];
}

function TeamSection({ title, team, entries }: TeamSectionProps) {
  const [name, setName] = useState('');
  const [score, setScore] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (!name.trim() || !score.trim()) return;

    const scoreNum = parseInt(score, 10);
    if (isNaN(scoreNum)) {
      setError('Score must be a number');
      return;
    }

    if (editId) {
      const { error: err } = await supabase
        .from('leaderboard_entries')
        .update({ name: name.trim(), score: scoreNum })
        .eq('id', editId);
      if (err) { setError(err.message); return; }
    } else {
      const { error: err } = await supabase
        .from('leaderboard_entries')
        .insert({ name: name.trim(), score: scoreNum, team });
      if (err) { setError(err.message); return; }
    }

    setName('');
    setScore('');
    setEditId(null);
  }

  function startEdit(entry: LeaderboardEntry) {
    setEditId(entry.id);
    setName(entry.name);
    setScore(String(entry.score));
  }

  function cancelEdit() {
    setEditId(null);
    setName('');
    setScore('');
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this entry?')) return;
    await supabase.from('leaderboard_entries').delete().eq('id', id);
  }

  return (
    <div>
      <h2 className="admin__section-title">{title}</h2>

      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="admin-form__field" style={{ flex: 1 }}>
          <label htmlFor={`name-${team}`}>Name</label>
          <input
            id={`name-${team}`}
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Enter name"
            required
          />
        </div>
        <div className="admin-form__field" style={{ width: '100px' }}>
          <label htmlFor={`score-${team}`}>Score</label>
          <input
            id={`score-${team}`}
            type="number"
            value={score}
            onChange={e => setScore(e.target.value)}
            placeholder="0"
            required
          />
        </div>
        <button className="btn btn--primary" type="submit">
          {editId ? 'Update' : 'Add'}
        </button>
        {editId && (
          <button className="btn btn--secondary" type="button" onClick={cancelEdit}>
            Cancel
          </button>
        )}
      </form>
      {error && <p style={{ color: 'var(--accent-coral)', fontSize: '13px', marginBottom: '8px' }}>{error}</p>}

      <table className="admin-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Score</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {entries.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '20px' }}>
                No entries yet
              </td>
            </tr>
          ) : (
            entries.map((entry, i) => (
              <tr key={entry.id}>
                <td>{i + 1}</td>
                <td>{entry.name}</td>
                <td>{entry.score.toLocaleString()}</td>
                <td>
                  <button
                    className="btn btn--secondary btn--small"
                    onClick={() => startEdit(entry)}
                    style={{ marginRight: '6px' }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn--danger btn--small"
                    onClick={() => handleDelete(entry.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

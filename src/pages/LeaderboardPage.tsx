import Header from '../components/Header';
import LeaderboardPanel from '../components/LeaderboardPanel';
import { useLeaderboardData } from '../hooks/useLeaderboardData';
import spacemanBlue from '../img/spaceman_blue.svg';
import spacemanCoral from '../img/spaceman_coral.svg';
import spacemanTeal from '../img/spaceman_teal.svg';
import spacemanCyan from '../img/spaceman_cyan.svg';
import spaceshipBlue from '../img/spaceship_ blue.svg';
import spaceshipCoral from '../img/spaceship_coral.svg';
import spaceshipTeal from '../img/spaceship_teal.svg';
import spaceshipCyan from '../img/spaceship_cyan.svg';

export default function LeaderboardPage() {
  const { accountManagers, salesTeams, loading, changedIds } = useLeaderboardData();

  if (loading) {
    return (
      <div className="tv-view" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: '24px', color: 'var(--text-secondary)' }}>
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div className="tv-view">
      <Header />
      <div className="leaderboards">
        <LeaderboardPanel
          title="Account Managers"
          entries={accountManagers}
          changedIds={changedIds}
          icons={{
            1: spacemanCoral,
            2: spacemanTeal,
            3: spacemanCyan,
            default: spacemanBlue,
          }}
          iconType="spaceman"
        />
        <LeaderboardPanel
          title="Sales Teams"
          entries={salesTeams}
          changedIds={changedIds}
          icons={{
            1: spaceshipCoral,
            2: spaceshipTeal,
            3: spaceshipCyan,
            default: spaceshipBlue,
          }}
          iconType="spaceship"
        />
      </div>
    </div>
  );
}

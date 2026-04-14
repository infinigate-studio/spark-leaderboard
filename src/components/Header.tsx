import logo from '../img/SPARK-logo_neg-only.svg';

export default function Header() {
  return (
    <header className="header">
      <img src={logo} alt="Spark" className="header__logo" />
      <h1 className="header__title">
        Leaderboard
      </h1>
    </header>
  );
}

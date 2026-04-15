import logo from '../img/SPARK-logo_neg-only.svg';

interface Props {
  title: string;
}

export default function Header({ title }: Props) {
  return (
    <header className="header">
      <img src={logo} alt="Spark" className="header__logo" />
      <h1 className="header__title">
        {title}
      </h1>
    </header>
  );
}

import Header from "./Header";

const HeaderLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="pt-[110px] flex-grow">{children}</main>
    </div>
  );
};

export default HeaderLayout;

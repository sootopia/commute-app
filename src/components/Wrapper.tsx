const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return <div className="relative max-w-[480px] min-h-dvh mx-auto px-5 bg-white">{children}</div>;
};

export default Wrapper;

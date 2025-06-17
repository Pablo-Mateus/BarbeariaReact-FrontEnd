import React from "react";
import footer from "../styles/Footer.module.css";
const Footer = () => {
  return (
    <>
      <footer className={`${footer.footerBg}`}>
        <div>
          <h1>© 2015 Barbearia Lipe Cortes LTDA. CNPJ: 12.456.789/0001-07</h1>
        </div>
      </footer>
    </>
  );
};

export default Footer;

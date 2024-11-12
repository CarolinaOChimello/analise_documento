"use client";

import React from "react";
import styles from "./page.module.css";

const Home = () => {
  const categories = {
    /*"Basic chat": "basic-chat",
    "Function calling": "function-calling",*/
    "Clique para continuar": "file-search",
    /*All: "all",*/
  };

  return (
    <main className={styles.main}>
      <div className={styles.title}>
      Esta é uma versão beta do novo recurso de leitura de documentos usando a Ada.
      </div>
      <div className={styles.container}>
        {Object.entries(categories).map(([name, url]) => (
          <a key={name} className={styles.category} href={`/Ada/${url}`}>
            {name}
          </a>
        ))}
      </div>
    </main>
  );
};

export default Home;

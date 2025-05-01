"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { SignInPage } from "@backstage/core-components";
import { githubAuthApiRef, googleAuthApiRef } from "@backstage/core-plugin-api";
import { Box, Button, Typography, IconButton } from "@material-ui/core";
import GitHubIcon from "@material-ui/icons/GitHub";
import CloseIcon from "@material-ui/icons/Close";

type CustomProps = {
  onSignInSuccess(identityApi: any): void;
  children?: React.ReactNode;
};

export const CustomSignInPage = (props: CustomProps) => {
  const [showGithub, setShowGithub] = useState(false);
  const [showGoogle, setShowGoogle] = useState(false);
  const signInPageRef = useRef<HTMLDivElement>(null);
  const githubCardRef = useRef<HTMLDivElement>(null);
  const googleCardRef = useRef<HTMLDivElement>(null);
  const starsContainerRef = useRef<HTMLDivElement>(null);

  const githubCardOriginalParent = useRef<HTMLElement | null>(null);
  const googleCardOriginalParent = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const createStars = () => {
      if (!starsContainerRef.current) return;
      
      starsContainerRef.current.innerHTML = '';
      
      // Criar 5 camadas de estrelas
      for (let i = 0; i < 5; i++) {
        const starLayer = document.createElement('div');
        starLayer.className = 'star-layer';
        
        // Gera um box-shadow com 200 estrelas por camada
        let boxShadow = '';
        for (let j = 0; j < 200; j++) {
          const x = (Math.random() * 200 - 100) + 'vw';
          const y = (Math.random() * 200 - 100) + 'vh';
          const size = Math.floor(Math.random() * 2) + 'px';
          const blur = '0px';
          const opacity = (Math.random() * 0.7 + 0.3).toFixed(2);
          
          boxShadow += `${x} ${y} ${blur} ${size} rgba(255,255,255,${opacity}),`;
        }
        boxShadow = boxShadow.slice(0, -1);
        
        starLayer.style.boxShadow = boxShadow;
        starLayer.style.animation = `scaleIn ${30 + i * 5}s linear forwards ${i * 2}s`;
        
        starsContainerRef.current.appendChild(starLayer);
      }
    };

    createStars();
    
    return () => {
      if (starsContainerRef.current) starsContainerRef.current.innerHTML = '';
    };
  }, []);

  useEffect(() => {
    const moveCards = () => {
      if (!signInPageRef.current) return;

      const allCards = Array.from(
        signInPageRef.current.querySelectorAll('div[class*="MuiCard-root"]')
      );

      const githubCard = allCards.find(card =>
        card.textContent?.includes("Entrar com GitHub")
      );
      const googleCard = allCards.find(card =>
        card.textContent?.includes("Entrar com Google")
      );

      if (showGithub && githubCard && githubCardRef.current) {
        if (!githubCardOriginalParent.current) {
          githubCardOriginalParent.current = githubCard.parentElement;
        }
        githubCardRef.current.innerHTML = "";
        githubCardRef.current.appendChild(githubCard);
      }

      if (!showGithub && githubCard && githubCardOriginalParent.current) {
        githubCardOriginalParent.current.appendChild(githubCard);
      }

      if (showGoogle && googleCard && googleCardRef.current) {
        if (!googleCardOriginalParent.current) {
          googleCardOriginalParent.current = googleCard.parentElement;
        }
        googleCardRef.current.innerHTML = "";
        googleCardRef.current.appendChild(googleCard);
      }

      if (!showGoogle && googleCard && googleCardOriginalParent.current) {
        googleCardOriginalParent.current.appendChild(googleCard);
      }
    };

    const timer = setTimeout(moveCards, 100);
    return () => clearTimeout(timer);
  }, [showGithub, showGoogle]);

  const starryBackgroundStyles = `
    .stars-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      z-index: 0;
    }
    
    .star-layer {
      position: absolute;
      top: 50%;
      left: 50%;
      height: 1px;
      width: 1px;
      background-color: transparent;
      border-radius: 50%;
      transform: translateZ(0);
      opacity: 1 !important;
    }
    
    @keyframes scaleIn {
      0% { transform: scale(1) translate(-50%, -50%); }
      100% { transform: scale(1.8) translate(-50%, -50%); }
    }
  `;

  return (
    <Box
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: starryBackgroundStyles }} />

      <div className="stars-container" ref={starsContainerRef}></div>

      <Box mb={4} display="flex" justifyContent="center" style={{ zIndex: 1 }}>
        <img
          src="/logo.png"
          alt="LEDSHUB Logo"
          style={{
            maxWidth: "400px",
            width: "100%",
            height: "auto",
          }}
        />
      </Box>

      <Box
        mb={3}
        display="flex"
        flexDirection="column"
        alignItems="center"
        style={{ width: "100%", maxWidth: "300px", zIndex: 1 }}
      >
        <Button
          variant="contained"
          style={{
            backgroundColor: "white",
            color: "black",
            padding: "12px 20px",
            marginBottom: "16px",
            width: "100%",
            textTransform: "none",
            fontSize: "16px",
            fontWeight: 500,
          }}
          startIcon={<GitHubIcon />}
          onClick={() => setShowGithub(true)}
        >
          Entrar com GitHub
        </Button>

        <Button
          variant="contained"
          style={{
            backgroundColor: "white",
            color: "black",
            padding: "12px 20px",
            width: "100%",
            textTransform: "none",
            fontSize: "16px",
            fontWeight: 500,
          }}
          startIcon={
            <svg style={{ width: "24px", height: "24px" }} viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.2,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.1,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.25,22C17.6,22 21.5,18.33 21.5,12.91C21.5,11.76 21.35,11.1 21.35,11.1V11.1Z"
              />
            </svg>
          }
          onClick={() => setShowGoogle(true)}
        >
          Entrar com Google
        </Button>
      </Box>

      <Typography
        variant="caption"
        style={{
          color: "#aaaaaa",
          marginTop: "32px",
          fontSize: "12px",
          zIndex: 1,
          position: 'absolute',
          bottom: '40px'
        }}
      >
        May the force be with you
      </Typography>

      {/* SignInPage escondida - agora usando div nativo */}
      <div
        style={{
          position: "absolute",
          visibility: "hidden",
          height: 0,
          overflow: "hidden",
          opacity: 0,
        }}
        ref={signInPageRef}
      >
        <SignInPage
          {...props}
          auto
          providers={[
            {
              id: "github",
              title: "Entrar com GitHub",
              message: "Use sua conta GitHub para entrar",
              apiRef: githubAuthApiRef,
            },
            {
              id: "google",
              title: "Entrar com Google",
              message: "Use sua conta Google para entrar",
              apiRef: googleAuthApiRef,
            },
          ]}
        />
      </div>

      {/* Modal GitHub */}
      {showGithub && (
        <Box
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={e => {
            if (e.target === e.currentTarget) {
              setShowGithub(false);
            }
          }}
        >
          <Box style={{ position: "relative" }}>
            <IconButton
              style={{
                position: "absolute",
                top: "8px",
                right: "8px",
                color: "#aaa",
                zIndex: 1100,
              }}
              onClick={() => setShowGithub(false)}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
            <div ref={githubCardRef}></div>
          </Box>
        </Box>
      )}

      {/* Modal Google */}
      {showGoogle && (
        <Box
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={e => {
            if (e.target === e.currentTarget) {
              setShowGoogle(false);
            }
          }}
        >
          <Box style={{ position: "relative" }}>
            <IconButton
              style={{
                position: "absolute",
                top: "8px",
                right: "8px",
                color: "#aaa",
                zIndex: 1100,
              }}
              onClick={() => setShowGoogle(false)}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
            <div ref={googleCardRef}></div>
          </Box>
        </Box>
      )}
    </Box>
  );
};
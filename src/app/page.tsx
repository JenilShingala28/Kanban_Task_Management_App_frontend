import * as React from "react";
import Container from "@mui/material/Container";
import LandingPage from "@/components/common/Landing";
export default function Home() {
  return (
    <>
      <Container
        maxWidth="lg"
        sx={{
          pt: { xs: 7, sm: 8 },
        }}
      >
        <LandingPage />
      </Container>
    </>
  );
}

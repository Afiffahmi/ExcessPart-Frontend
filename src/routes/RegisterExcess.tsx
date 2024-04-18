import * as React from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import List from '@mui/joy/List';
import Sheet from '@mui/joy/Sheet';

import Layout from '../components/Layout';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import { Typography } from '@mui/joy';
import { Divider } from '@mui/joy';
import ExcessRegForm from '../components/ExcessRegForm';

export default function TeamExample() {
  const [drawerOpen, setDrawerOpen] = React.useState(false);


  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      {drawerOpen && (
        <Layout.SideDrawer onClose={() => setDrawerOpen(false)}>
          <Navigation />
        </Layout.SideDrawer>
      )}
      <Layout.Root
        sx={{
          ...(drawerOpen && {
            height: '100vh',
            overflow: 'hidden',
          }),
        }}
      >

        <Layout.SideNav>
          <Typography component={'h1'}>EPMS</Typography>
          <Divider />
          <Navigation />
          <Header />
        </Layout.SideNav>
        
        <Layout.Main >
          <List
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(1300px, 1fr))',
              gap: 1,
            }}
          >
              <Sheet
                component="li"
                variant="outlined"
                sx={{
                  borderRadius: 'sm',
                  p: 2,
                  listStyle: 'none',
                }}
              ><Layout.SidePane sx={{
                
              }}>
                <ExcessRegForm />
              </Layout.SidePane>
              </Sheet>
          </List>
        </Layout.Main>
      </Layout.Root>
    </CssVarsProvider>
  );
}
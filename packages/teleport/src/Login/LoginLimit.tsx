import React from 'react';
import { LoginLimit as CardFailed } from 'design/CardError';
import { Route, Switch } from 'teleport/components/Router';
import LogoHero from 'teleport/components/LogoHero';
import cfg from 'teleport/config';


export default function Container() {
  return (
    <Switch>
      <Route path={cfg.routes.loginErrorConnLimit}>
        <LoginLimit message="connection limit reached, please try to connect a bit later" />
      </Route>
      <Route component={LoginLimit} />
    </Switch>
  );
}

export function LoginLimit({ message }: { message?: string }) {
  return (
    <>
      <LogoHero />
      <CardFailed loginUrl={cfg.routes.login} message={message} />
    </>
  );
}

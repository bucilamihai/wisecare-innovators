import React, { useEffect, useState } from "react";
import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonRouterOutlet,
  setupIonicReact,
  IonPage,
  IonContent,
  IonSpinner,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
// import "@ionic/react/css/padding.css";
// import "@ionic/react/css/float-elements.css";
// import "@ionic/react/css/text-alignment.css";
// import "@ionic/react/css/text-transformation.css";
// import "@ionic/react/css/flex-utils.css";
// import "@ionic/react/css/display.css";

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import "@ionic/react/css/palettes/dark.system.css";

/* Theme variables */
import "./theme/variables.css";
import Registration from "./pages/Registration/Registration.tsx";
import Login from "./pages/Login/Login.tsx";
import Home from "./pages/Home/Home.tsx";
import Health from "./pages/Health/Health.tsx";
import Chat from "./pages/Chat/Chat.tsx";
import Reminders from "./pages/Reminders/Reminders.tsx";
import Settings from "./pages/Settings/Settings.tsx";
import AccountInfo from "./pages/AccountInfo/AccountInfo.tsx";
import Sudoku from "./pages/Games/Sudoku.tsx";

import { isUserLoggedIn } from "./services/auth";
import AppProvider from "./context/AppProvider.tsx";

setupIonicReact();

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      const loggedIn = await isUserLoggedIn();
      setIsAuthenticated(loggedIn);
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <IonPage>
        <IonContent className="ion-text-center ion-padding">
          <IonSpinner name="crescent" />
          <p>Checking authentication status...</p>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonApp>
      <AppProvider>
        <IonReactRouter>
          <IonRouterOutlet>
            {isAuthenticated ? (
              <>
                <Route exact path="/" render={() => <Redirect to="/home" />} />
                <Route exact path="/home" component={Home} />
                <Route exact path="/health" component={Health} />
                <Route exact path="/chat" component={Chat} />
                <Route exact path="/settings" component={Settings} />
                <Route exact path="/reminders" component={Reminders} />
                <Route exact path="/account" component={AccountInfo} />
                <Route path="/sudoku" component={Sudoku} />
                {/*<Route path="/tic-tac-toe" component={TicTacToe} />*/}
                {/*<Route path="/planes" component={Planes} />*/}
              </>
            ) : (
              <>
                <Route exact path="/" render={() => <Redirect to="/login" />} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/register" component={Registration} />
              </>
            )}
          </IonRouterOutlet>
        </IonReactRouter>
      </AppProvider>
    </IonApp>
  );
};

export default App;

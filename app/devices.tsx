import React from 'react';
import { Redirect } from 'expo-router';

export default function DevicesRouteRedirect() {
  return <Redirect href="/(tabs)/devices" />;
}

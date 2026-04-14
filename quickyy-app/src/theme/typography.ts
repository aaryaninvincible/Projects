import { StyleSheet } from 'react-native';

export const typography = StyleSheet.create({
  h1: {
    fontSize: 32,
    fontWeight: '800', // Extra bold for headers
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
  },
  caption: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  button: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  }
});

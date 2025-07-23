
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';

export const MENU_ITEMS = [
  { icon: <Feather name="home" size={24} color="#007aff" />, label: 'Home' , route:'/' },
  { icon: <MaterialCommunityIcons name="information-outline" size={24} color="#007aff" />, label: 'About', route:'/about' },
  { icon: <Feather name="settings" size={24} color="#007aff" />, label: 'Settings', route:'/settings'  },
  { icon: <Feather name="mail" size={24} color="#007aff" />, label: 'Contact' , route:'/contact' },
  { icon: <Feather name="briefcase" size={24} color="#007aff" />, label: 'Portfolio' , route:'/portfolio' },
];

export const HISTORY_ITEMS = [
  { id: 1, title: 'Landscape Study', date: '2024-06-01' },
  { id: 2, title: 'Old Town', date: '2024-05-29' },
  { id: 3, title: 'Seaside Morning', date: '2024-05-20' },
  { id: 4, title: 'Still Life #1', date: '2024-05-11' },
  { id: 5, title: 'Portrait of Anna', date: '2024-04-28' },
  { id: 6, title: 'Night Sky', date: '2024-04-15' },
  { id: 7, title: 'Classic Bridge', date: '2024-04-01' },
  { id: 8, title: 'Fantasy Scene', date: '2024-03-21' },
];

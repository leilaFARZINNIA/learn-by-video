import { Dimensions, Platform } from 'react-native';
import DrawerMobile from '../../components/sideMenu/ DrawerMobile';
import DrawerWeb from '../../components/sideMenu/DrawerWeb';

export default function DrawerContainer({ children }: { children: React.ReactNode }) {
  const windowWidth = Dimensions.get('window').width;
  const isMobile = windowWidth < 600;
  if (Platform.OS === 'web' && !isMobile) {
    return <DrawerWeb>{children}</DrawerWeb>;
  } else {
    return <DrawerMobile>{children}</DrawerMobile>;
  }
}

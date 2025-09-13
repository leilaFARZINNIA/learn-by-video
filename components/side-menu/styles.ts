import { StyleSheet } from 'react-native';



export default StyleSheet.create({

  

  sidebar: {
   
    alignItems: 'flex-start',
    paddingTop: 38,
    borderRightWidth: 1,
    shadowOpacity: 0.13,
    shadowRadius: 18,
    shadowOffset: { width: 4, height: 6 },
    elevation: 15,
    overflow: 'hidden',
   
    borderBottomRightRadius: 32,
    minHeight: '100%',
  },
  icon: {
    marginVertical: 14,
    marginLeft: 18,
   
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '92%',
    minHeight: 45,
    marginLeft: 8,
    marginBottom: 8,
    borderRadius: 14,
    paddingHorizontal: 6,
    backgroundColor: 'transparent',
    
   
  },
  label: {
    fontSize: 16,
    marginLeft: 20,
 
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  divider: {
    height: 1.2,
   
    width: '88%',
    alignSelf: 'center',
    marginVertical: 16,
    borderRadius: 3,
  },
  sectionTitle: {
    fontSize: 13.5,
    fontWeight: 'bold',
  
    marginBottom: 10,
    marginTop: 8,
    marginLeft: 14,
    letterSpacing: 0.4,
  },
  historyContainer: {
    flex: 1,
    width: '98%',
    maxHeight: 320,
    marginLeft: 4,
    marginTop: 4,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingLeft: 14,
    marginBottom: 7,
    borderRadius: 10,
  
    marginRight: 10,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 1,
    shadowOffset: { width: 1, height: 1 },
    
  },
  historyTitle: {
    fontSize: 15,

    fontWeight: '500',
  },
  historyDate: {
    fontSize: 11,

    marginTop: 1,
  },
  backdrop: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: 998,
  },
});

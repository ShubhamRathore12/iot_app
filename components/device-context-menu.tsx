import { Activity, AlertCircle, BarChart2, Power, Settings, Sliders, Wrench, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Animated, Dimensions, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

type MenuItem = {
  id: string;
  title: string;
  icon: React.ReactNode;
  onPress: () => void;
};

type MachineType = 'chiller' | 'dryer' | 'conveyor' | 'silo';

const menuItemsByType: Record<MachineType, MenuItem[]> = {
  chiller: [
    {
      id: 'settings',
      title: 'Settings',
      icon: <Settings size={24} color="#1a73e8" />,
      onPress: () => console.log('Chiller Settings')
    },
    {
      id: 'monitor',
      title: 'Monitor',
      icon: <Activity size={24} color="#1a73e8" />,
      onPress: () => console.log('Monitor Chiller')
    },
    {
      id: 'analytics',
      title: 'Analytics',
      icon: <BarChart2 size={24} color="#1a73e8" />,
      onPress: () => console.log('Chiller Analytics')
    },
    {
      id: 'alerts',
      title: 'Alerts',
      icon: <AlertCircle size={24} color="#1a73e8" />,
      onPress: () => console.log('Chiller Alerts')
    },
    {
      id: 'power',
      title: 'Power Controls',
      icon: <Power size={24} color="#1a73e8" />,
      onPress: () => console.log('Power Controls')
    }
  ],
  dryer: [
    {
      id: 'settings',
      title: 'Dryer Settings',
      icon: <Settings size={24} color="#1a73e8" />,
      onPress: () => console.log('Dryer Settings')
    },
    {
      id: 'monitor',
      title: 'Dryer Monitor',
      icon: <Activity size={24} color="#1a73e8" />,
      onPress: () => console.log('Monitor Dryer')
    },
    {
      id: 'analytics',
      title: 'Drying Analytics',
      icon: <BarChart2 size={24} color="#1a73e8" />,
      onPress: () => console.log('Drying Analytics')
    }
  ],
  conveyor: [
    {
      id: 'settings',
      title: 'Conveyor Settings',
      icon: <Settings size={24} color="#1a73e8" />,
      onPress: () => console.log('Conveyor Settings')
    },
    {
      id: 'controls',
      title: 'Speed Controls',
      icon: <Sliders size={24} color="#1a73e8" />,
      onPress: () => console.log('Speed Controls')
    },
    {
      id: 'maintenance',
      title: 'Maintenance',
      icon: <Wrench size={24} color="#1a73e8" />,
      onPress: () => console.log('Maintenance')
    }
  ],
  silo: [
    {
      id: 'inventory',
      title: 'Inventory',
      icon: <BarChart2 size={24} color="#1a73e8" />,
      onPress: () => console.log('Silo Inventory')
    },
    {
      id: 'settings',
      title: 'Silo Settings',
      icon: <Settings size={24} color="#1a73e8" />,
      onPress: () => console.log('Silo Settings')
    },
    {
      id: 'monitor',
      title: 'Monitor Levels',
      icon: <Activity size={24} color="#1a73e8" />,
      onPress: () => console.log('Monitor Levels')
    }
  ]
};

type DeviceContextMenuProps = {
  visible: boolean;
  onClose: () => void;
  machineType: MachineType;
  position: { x: number; y: number };
};

export default function DeviceContextMenu({ visible, onClose, machineType, position }: DeviceContextMenuProps) {
  const [animation] = useState(new Animated.Value(0));
  const menuItems = menuItemsByType[machineType] || [];

  React.useEffect(() => {
    if (visible) {
      Animated.spring(animation, {
        toValue: 1,
        useNativeDriver: false,
        friction: 5
      }).start();
    } else {
      animation.setValue(0);
    }
  }, [visible]);

  if (!visible) return null;

  const scale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1]
  });

  const opacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1]
  });

  return (
    <View style={styles.overlay}>
      <TouchableOpacity
        style={StyleSheet.absoluteFill}
        activeOpacity={1}
        onPress={onClose}
      />
      <Animated.View
        style={[
          styles.menuContainer,
          {
            top: Math.min(position.y, height - 300),
            opacity,
            transform: [
              { translateX: position.x > width / 2 ? position.x - 200 : position.x },
              { scale }
            ]
          }
        ]}
      >
        <View style={styles.menuContent}>
          <View style={styles.header}>
            <Text style={styles.title}>{machineType.charAt(0).toUpperCase() + machineType.slice(1)} Menu</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={20} color="#666" />
            </TouchableOpacity>
          </View>
          <View style={styles.menuItems}>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                onPress={() => {
                  item.onPress();
                  onClose();
                }}
              >
                <View style={styles.iconContainer}>
                  {item.icon}
                </View>
                <Text style={styles.menuItemText}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    position: 'absolute',
    zIndex: 1001,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  menuContent: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    width: 250,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  menuItems: {
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  iconContainer: {
    width: 32,
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 15,
    color: '#333',
  },
});

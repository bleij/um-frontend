import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView, Switch } from 'react-native';
import { useAuth, UserRole } from '../contexts/AuthContext';
import { useParentData } from '../contexts/ParentDataContext';
import { COLORS, RADIUS, SHADOWS } from '../constants/theme';
import { Feather } from '@expo/vector-icons';

export function DevRoleSwitcher() {
  // Only show in development
  if (!__DEV__) return null;

  const [visible, setVisible] = useState(false);
  const { user, setUserRole, devLogin, devMode, setDevMode } = useAuth();
  const { parentProfile, setParentTariff } = useParentData();

  const roles: UserRole[] = ['parent', 'youth', 'child', 'mentor', 'org', 'teacher', 'admin'];

  const handleSwitch = async (role: UserRole) => {
    if (!user) {
      await devLogin(role);
    } else {
      await setUserRole(role);
    }
    setVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setVisible(true)}
        style={styles.floatingButton}
        activeOpacity={0.8}
      >
        <Feather name="settings" size={20} color="white" />
        <Text style={styles.buttonText}>DEV</Text>
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setVisible(false)}
        >
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <View style={styles.header}>
              <Text style={styles.title}>Developer Tools</Text>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <Feather name="x" size={24} color={COLORS.mutedForeground} />
              </TouchableOpacity>
            </View>

            <ScrollView>
              <View style={styles.devModeRow}>
                <View>
                  <Text style={styles.devModeTitle}>Dev Mode</Text>
                  <Text style={styles.devModeSubtitle}>Disable auto-redirect to Home</Text>
                </View>
                <Switch
                  value={devMode}
                  onValueChange={setDevMode}
                  trackColor={{ false: COLORS.muted, true: COLORS.primary }}
                />
              </View>

              {['parent', 'youth', 'child'].includes(user?.role || '') && (
                 <View style={styles.devModeRow}>
                   <View>
                     <Text style={styles.devModeTitle}>Tariff Status: {parentProfile?.tariff?.toUpperCase() || 'BASIC'}</Text>
                     <Text style={styles.devModeSubtitle}>Toggle PRO features for parent/child</Text>
                   </View>
                   <Switch
                     value={parentProfile?.tariff === 'pro'}
                     onValueChange={(val) => setParentTariff(val ? 'pro' : 'basic')}
                     trackColor={{ false: COLORS.muted, true: '#A78BFA' }}
                   />
                 </View>
              )}

              <Text style={styles.sectionTitle}>Current Role: {user?.role || 'None'}</Text>
              
              <View style={styles.grid}>
                {roles.map((role) => (
                  <TouchableOpacity
                    key={role}
                    style={[
                      styles.roleButton,
                      user?.role === role && styles.activeRoleButton
                    ]}
                    onPress={() => handleSwitch(role)}
                  >
                    <Text style={[
                      styles.roleButtonText,
                      user?.role === role && styles.activeRoleButtonText
                    ]}>
                      {role}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF3B30',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    ...SHADOWS.lg,
    flexDirection: 'column',
  },
  buttonText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '800',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: RADIUS.lg,
    borderTopRightRadius: RADIUS.lg,
    padding: 24,
    minHeight: 300,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.foreground,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    color: COLORS.mutedForeground,
  },
  devModeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 20,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  devModeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.foreground,
  },
  devModeSubtitle: {
    fontSize: 12,
    color: COLORS.mutedForeground,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  roleButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.muted,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activeRoleButton: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  roleButtonText: {
    color: COLORS.foreground,
    fontWeight: '500',
  },
  activeRoleButtonText: {
    color: 'white',
  },
  forceLoginButton: {
    marginTop: 10,
    padding: 15,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.secondary,
    alignItems: 'center',
  },
  forceLoginText: {
    color: 'white',
    fontWeight: '600',
  }
});

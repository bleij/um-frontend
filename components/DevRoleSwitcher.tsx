import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, Modal, StyleSheet,
  ScrollView, Switch, Platform, useWindowDimensions, Pressable,
} from 'react-native';
import { useAuth, UserRole } from '../contexts/AuthContext';
import { useDevSettings } from '../contexts/DevSettingsContext';
import { useParentData } from '../contexts/ParentDataContext';
import { COLORS, RADIUS, SHADOWS } from '../constants/theme';
import { Feather } from '@expo/vector-icons';

export function DevRoleSwitcher() {
  if (!__DEV__) return null;

  const [visible, setVisible] = useState(false);
  const { user, setUserRole, devLogin, devMode, setDevMode } = useAuth();
  const { parentProfile, setParentTariff } = useParentData();
  const { mentorApproved, setMentorApproved, orgVerified, setOrgVerified } = useDevSettings();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 768;

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
        animationType={isDesktop ? 'fade' : 'slide'}
        onRequestClose={() => setVisible(false)}
      >
        {/* Backdrop — stops propagation so inner presses don't bubble up */}
        <Pressable
          style={[styles.modalOverlay, isDesktop && styles.modalOverlayDesktop]}
          onPress={() => setVisible(false)}
        >
          {/* Inner card — swallows taps so backdrop doesn't fire */}
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={[styles.modalContent, isDesktop && styles.modalContentDesktop]}
          >
            <View style={styles.header}>
              <Text style={styles.title}>Developer Tools</Text>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <Feather name="x" size={24} color={COLORS.mutedForeground} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Dev mode toggle */}
              <View style={styles.devModeRow}>
                <View style={{ flex: 1, marginRight: 12 }}>
                  <Text style={styles.devModeTitle}>Dev Mode</Text>
                  <Text style={styles.devModeSubtitle}>Disable auto-redirect to Home</Text>
                </View>
                <Switch
                  value={devMode}
                  onValueChange={setDevMode}
                  trackColor={{ false: COLORS.muted, true: COLORS.primary }}
                />
              </View>

              {/* Tariff toggle (parent/child roles) */}
              {['parent', 'youth', 'child'].includes(user?.role || '') && (
                <View style={styles.devModeRow}>
                  <View style={{ flex: 1, marginRight: 12 }}>
                    <Text style={styles.devModeTitle}>
                      Tariff: {parentProfile?.tariff?.toUpperCase() || 'BASIC'}
                    </Text>
                    <Text style={styles.devModeSubtitle}>Toggle PRO features</Text>
                  </View>
                  <Switch
                    value={parentProfile?.tariff === 'pro'}
                    onValueChange={(val) => setParentTariff(val ? 'pro' : 'basic')}
                    trackColor={{ false: COLORS.muted, true: '#A78BFA' }}
                  />
                </View>
              )}

              {/* Mentor approval toggle */}
              {user?.role === 'mentor' && (
                <View style={styles.devModeRow}>
                  <View style={{ flex: 1, marginRight: 12 }}>
                    <Text style={styles.devModeTitle}>
                      Mentor: {mentorApproved ? 'Approved ✓' : 'Pending…'}
                    </Text>
                    <Text style={styles.devModeSubtitle}>Simulate admin approval state</Text>
                  </View>
                  <Switch
                    value={mentorApproved}
                    onValueChange={setMentorApproved}
                    trackColor={{ false: COLORS.muted, true: COLORS.success }}
                  />
                </View>
              )}

              {/* Org verification toggle */}
              {user?.role === 'org' && (
                <View style={styles.devModeRow}>
                  <View style={{ flex: 1, marginRight: 12 }}>
                    <Text style={styles.devModeTitle}>
                      Org: {orgVerified ? 'Verified ✓' : 'Pending…'}
                    </Text>
                    <Text style={styles.devModeSubtitle}>Simulate admin verification state</Text>
                  </View>
                  <Switch
                    value={orgVerified}
                    onValueChange={setOrgVerified}
                    trackColor={{ false: COLORS.muted, true: COLORS.success }}
                  />
                </View>
              )}

              {/* Current user info */}
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Role</Text>
                <Text style={styles.infoValue}>{user?.role || 'none'}</Text>
              </View>
              <View style={[styles.infoRow, { marginBottom: 16 }]}>
                <Text style={styles.infoLabel}>User ID</Text>
                <Text style={[styles.infoValue, { fontSize: 11 }]} numberOfLines={1}>
                  {user?.id || '—'}
                </Text>
              </View>

              <Text style={styles.sectionTitle}>Switch role</Text>
              <View style={styles.grid}>
                {roles.map((role) => (
                  <TouchableOpacity
                    key={role}
                    style={[styles.roleButton, user?.role === role && styles.activeRoleButton]}
                    onPress={() => handleSwitch(role)}
                  >
                    <Text style={[styles.roleButtonText, user?.role === role && styles.activeRoleButtonText]}>
                      {role}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </Pressable>
        </Pressable>
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
  // Mobile: slide-up sheet
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  // Desktop: centered dialog
  modalOverlayDesktop: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: RADIUS.lg,
    borderTopRightRadius: RADIUS.lg,
    padding: 24,
    maxHeight: '85%',
  },
  modalContentDesktop: {
    borderRadius: RADIUS.lg,
    width: 420,
    maxHeight: '80%',
    ...SHADOWS.lg,
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
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 12,
    color: COLORS.mutedForeground,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  devModeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  devModeTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.foreground,
  },
  devModeSubtitle: {
    fontSize: 12,
    color: COLORS.mutedForeground,
    marginTop: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  infoLabel: {
    fontSize: 13,
    color: COLORS.mutedForeground,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.foreground,
    flex: 1,
    textAlign: 'right',
    marginLeft: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  roleButton: {
    paddingHorizontal: 14,
    paddingVertical: 9,
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
    fontSize: 13,
  },
  activeRoleButtonText: {
    color: 'white',
  },
});

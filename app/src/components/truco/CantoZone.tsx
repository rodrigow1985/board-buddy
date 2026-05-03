import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  Colors,
  FontWeights,
  FontSizes,
  Spacing,
  Radii,
  HitTargets,
} from '@src/constants/tokens';
import { useTrucoStore, HandStatus, ActiveCanto, PointsRecord } from '@src/store/trucoStore';

export function CantoZone() {
  const hand = useTrucoStore((s) => s.currentHand);
  const teams = useTrucoStore((s) => s.teams);
  const { respondCanto, assignWinner, confirmPoints, cancelPoints } =
    useTrucoStore.getState();

  if (hand.status === 'playing' || hand.status === 'idle' || hand.status === 'hand_complete') {
    return <IdleZone handNumber={useTrucoStore.getState().handNumber} />;
  }

  if (hand.status === 'canto_pending' && hand.activeCanto) {
    return (
      <PendingZone
        canto={hand.activeCanto}
        onAccept={() => respondCanto('accepted')}
        onReject={() => respondCanto('rejected')}
      />
    );
  }

  if (hand.status === 'resolving' && hand.activeCanto) {
    return (
      <ResolvingZone
        canto={hand.activeCanto}
        teams={teams}
        onSelectTeam={assignWinner}
        onCancel={cancelPoints}
      />
    );
  }

  if (hand.status === 'confirming' && hand.pendingPoints) {
    return (
      <ConfirmingZone
        points={hand.pendingPoints}
        teamName={teams[hand.pendingPoints.team].name}
        onConfirm={confirmPoints}
        onCancel={cancelPoints}
      />
    );
  }

  return null;
}

// ─── Sub-componentes ──────────────────────────────────────────────

function IdleZone({ handNumber }: { handNumber: number }) {
  return (
    <View style={styles.zone}>
      <Text style={styles.idleText}>Mano {handNumber}</Text>
      <Text style={styles.idleHint}>Cantá o usá los botones de abajo</Text>
    </View>
  );
}

function PendingZone({
  canto,
  onAccept,
  onReject,
}: {
  canto: ActiveCanto;
  onAccept: () => void;
  onReject: () => void;
}) {
  const label = cantoLabel(canto.level as string);
  return (
    <View style={styles.zone}>
      <View style={styles.cantoHeader}>
        <Ionicons name="mic" size={16} color={Colors.terracotta} />
        <Text style={styles.cantoTitle}>{label}</Text>
      </View>
      <Text style={styles.pointsText}>En juego: {canto.pointsIfAccepted} pts</Text>
      <View style={styles.btnRow}>
        <ActionButton label="Quiero" onPress={onAccept} variant="primary" />
        <ActionButton label="No quiero" onPress={onReject} variant="secondary" />
      </View>
    </View>
  );
}

function ResolvingZone({
  canto,
  teams,
  onSelectTeam,
  onCancel,
}: {
  canto: ActiveCanto;
  teams: [{ name: string }, { name: string }];
  onSelectTeam: (team: 0 | 1) => void;
  onCancel: () => void;
}) {
  const label = cantoLabel(canto.level as string);
  return (
    <View style={styles.zone}>
      <Text style={styles.cantoTitle}>{label} querido</Text>
      <Text style={styles.pointsText}>¿Quién ganó? ({canto.pointsIfAccepted} pts)</Text>
      <View style={styles.btnRow}>
        <ActionButton label={teams[0].name} onPress={() => onSelectTeam(0)} variant="primary" />
        <ActionButton label={teams[1].name} onPress={() => onSelectTeam(1)} variant="primary" />
      </View>
      <Pressable onPress={onCancel} style={styles.cancelBtn}>
        <Text style={styles.cancelText}>Cancelar</Text>
      </Pressable>
    </View>
  );
}

function ConfirmingZone({
  points,
  teamName,
  onConfirm,
  onCancel,
}: {
  points: PointsRecord;
  teamName: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <View style={styles.zone}>
      <Text style={styles.cantoTitle}>{teamName}</Text>
      <Text style={styles.confirmPoints}>+{points.amount} pts</Text>
      <Text style={styles.confirmReason}>{points.reason}</Text>
      <View style={styles.btnRow}>
        <ActionButton label="Confirmar" onPress={onConfirm} variant="confirm" />
        <ActionButton label="Cancelar" onPress={onCancel} variant="secondary" />
      </View>
    </View>
  );
}

function ActionButton({
  label,
  onPress,
  variant,
}: {
  label: string;
  onPress: () => void;
  variant: 'primary' | 'secondary' | 'confirm';
}) {
  const bgStyle =
    variant === 'confirm'
      ? styles.btnConfirm
      : variant === 'primary'
      ? styles.btnPrimary
      : styles.btnSecondary;

  return (
    <Pressable
      style={({ pressed }) => [styles.btn, bgStyle, pressed && styles.btnPressed]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.btnLabel,
          variant === 'secondary' && styles.btnLabelSecondary,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function cantoLabel(level: string): string {
  const labels: Record<string, string> = {
    envido: 'ENVIDO',
    real_envido: 'REAL ENVIDO',
    falta_envido: 'FALTA ENVIDO',
    truco: 'TRUCO',
    retruco: 'RETRUCO',
    vale_cuatro: 'VALE CUATRO',
    flor: 'FLOR',
    contra_flor: 'CONTRA FLOR',
    contra_flor_al_resto: 'CONTRA FLOR AL RESTO',
  };
  return labels[level] ?? level.toUpperCase();
}

// ─── Estilos ──────────────────────────────────────────────────────

const styles = StyleSheet.create({
  zone: {
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  idleText: {
    fontFamily: FontWeights.sans.semibold,
    fontSize: FontSizes.body,
    color: 'rgba(255,255,255,0.7)',
  },
  idleHint: {
    fontFamily: FontWeights.sans.regular,
    fontSize: FontSizes.captionS,
    color: 'rgba(255,255,255,0.4)',
  },
  cantoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  cantoTitle: {
    fontFamily: FontWeights.sans.bold,
    fontSize: FontSizes.displayS,
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  pointsText: {
    fontFamily: FontWeights.sans.medium,
    fontSize: FontSizes.body,
    color: 'rgba(255,255,255,0.8)',
  },
  confirmPoints: {
    fontFamily: FontWeights.display.semibold,
    fontSize: FontSizes.displayL,
    color: '#FFFFFF',
  },
  confirmReason: {
    fontFamily: FontWeights.sans.regular,
    fontSize: FontSizes.caption,
    color: 'rgba(255,255,255,0.6)',
  },
  btnRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  btn: {
    minWidth: 100,
    height: HitTargets.min,
    borderRadius: Radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
  },
  btnPrimary: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  btnSecondary: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  btnConfirm: {
    backgroundColor: Colors.terracotta,
  },
  btnPressed: {
    opacity: 0.7,
  },
  btnLabel: {
    fontFamily: FontWeights.sans.semibold,
    fontSize: FontSizes.bodyS,
    color: '#FFFFFF',
  },
  btnLabelSecondary: {
    color: 'rgba(255,255,255,0.7)',
  },
  cancelBtn: {
    paddingVertical: Spacing.sm,
  },
  cancelText: {
    fontFamily: FontWeights.sans.regular,
    fontSize: FontSizes.captionS,
    color: 'rgba(255,255,255,0.5)',
  },
});

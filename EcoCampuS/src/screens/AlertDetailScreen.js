import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';

// Fonction pour formater les dates
const formatDateTime = (dateString) => {
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  };
  return new Date(dateString)
    .toLocaleString('fr-FR', options)
    .replace(',', '');
};

const AlertDetailScreen = ({ route, navigation }) => {
  const { alerte } = route.params;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F6F9" />
      <ScrollView
        contentContainerStyle={{ paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Image */}
        {alerte.imageUrl ? (
          <Image
            source={{ uri: alerte.imageUrl }}
            style={styles.alertImage}
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderText}>Image non disponible</Text>
          </View>
        )}

        {/* Card principale */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Détails de l'alerte</Text>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Description:</Text>
            <Text style={styles.value}>{alerte.description}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Utilisateur ID:</Text>
            <Text style={styles.value}>{alerte.userId}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Statut:</Text>
            <Text style={[styles.value, alerte.statut === 'envoyé' ? styles.statusPending : styles.statusDone]}>
              {alerte.statut}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Créé le:</Text>
            <Text style={styles.value}>{formatDateTime(alerte.createdAt)}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Mis à jour le:</Text>
            <Text style={styles.value}>{formatDateTime(alerte.updatedAt)}</Text>
          </View>

          {/* Bouton itinéraire */}
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => {
              if (!alerte.latitude || !alerte.longitude) {
                alert('Coordonnées non disponibles pour cette alerte.');
                return;
              }
              navigation.navigate('MapScreen', {
                latitude: alerte.latitude,
                longitude: alerte.longitude,
              });
            }}
          >
            <Text style={styles.buttonText}>Voir l'itinéraire</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F9',
  },
  alertImage: {
    width: '92%',
    height: 220,
    borderRadius: 18,
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  imagePlaceholder: {
    width: '92%',
    height: 220,
    borderRadius: 18,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
    marginTop: 20,
    marginBottom: 16,
  },
  placeholderText: {
    color: '#777',
    fontSize: 16,
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 18,
    padding: 20,
    elevation: 6, // ombre pour effet premium
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  infoRow: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: '#777',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  statusPending: {
    color: '#B3261E',
    fontWeight: 'bold',
  },
  statusDone: {
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  primaryButton: {
    marginTop: 20,
    backgroundColor: '#1B5E20',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AlertDetailScreen;
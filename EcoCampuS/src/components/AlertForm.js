

/*import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Image } from 'react-native';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';

const AlertForm = ({ onSubmit }) => {
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(null);
  const [image, setImage] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleCreateAlert = () => {
    if (location && image) {
      onSubmit({
        description,
        location: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
        image,
      });
    } else {
      console.log('Location or image is missing');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <Button title="Take a Photo" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <Button title="Create Alert" onPress={handleCreateAlert} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 12,
  },
});

export default AlertForm;
*/
const express = require('express');
const alertController = require('../controllers/alert.controller');
const checkAuthMiddleware = require('../middleware/check-auth');
const imageUploader = require('../helpers/image-uploader');

const router = express.Router();


router.get("/getAlertById/:id",checkAuthMiddleware,imageUploader.upload.single('image'), alertController.getAlertById)

router.post("/create", checkAuthMiddleware,imageUploader.upload.single('image'), alertController.save);


router.get("/show",checkAuthMiddleware,alertController.show);

router.get("/showC", checkAuthMiddleware, alertController.showC);

router.get("/all", checkAuthMiddleware, alertController.index);

router.get("/allC", checkAuthMiddleware, alertController.index);

router.get("/:collectorId", checkAuthMiddleware, alertController.showDC);

router.get("/:UserId", checkAuthMiddleware, alertController.showDU);

router.patch("/:alertId", checkAuthMiddleware,imageUploader.upload.single('image'), alertController.update);

router.delete("/:Id", checkAuthMiddleware, alertController.destroy);

router.patch('/assign/:alertId', checkAuthMiddleware, alertController.assignCollector);

module.exports = router;

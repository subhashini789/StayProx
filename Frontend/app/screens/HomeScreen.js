import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import api from "../../services/api";

export default function HomeScreen() {

  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    getRooms();
  }, []);

  const getRooms = async () => {
    const response = await api.get("/rooms");
    setRooms(response.data);
  };

  return (
    <View>
      {rooms.map((room, index) => (
        <Text key={index}>{room.title}</Text>
      ))}
    </View>
  );
}
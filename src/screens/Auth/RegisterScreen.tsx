import { View, Text, KeyboardAvoidingView, TextInput, TouchableOpacity } from 'react-native'
import React, { FC, useState } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';

type RegisterScreenProps = NativeStackScreenProps<RootStackParamList, "Register">

const RegisterScreen: FC<RegisterScreenProps> = (props) => {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [image, setImage] = useState("https://p4.wallpaperbetter.com/wallpaper/197/961/194/guitar-boy-girl-i-play-for-you-wallpaper-preview.jpg");

    const handleRegister = () => {
        console.log("handleRegister")
    }

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: "white",
                padding: 10,
                alignItems: "center",
            }}
        >
            <KeyboardAvoidingView>
                <View
                    style={{
                        marginTop: 100,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Text style={{ color: "#4A55A2", fontSize: 17, fontWeight: "600" }}>
                        Register
                    </Text>

                    <Text style={{ fontSize: 17, fontWeight: "600", marginTop: 15 }}>
                        Register To your Account
                    </Text>
                </View>

                <View style={{ marginTop: 50 }}>
                    <View style={{ marginTop: 10 }}>
                        <Text style={{ fontSize: 18, fontWeight: "600", color: "gray" }}>
                            Name
                        </Text>

                        <TextInput
                            value={name}
                            onChangeText={(text) => setName(text)}
                            style={{
                                fontSize: email ? 18 : 18,
                                borderBottomColor: "gray",
                                borderBottomWidth: 1,
                                marginVertical: 10,
                                width: 300,
                            }}
                            placeholderTextColor={"black"}
                            placeholder="Enter your name"
                        />
                    </View>

                    <View>
                        <Text style={{ fontSize: 18, fontWeight: "600", color: "gray" }}>
                            Email
                        </Text>

                        <TextInput
                            value={email}
                            onChangeText={(text) => setEmail(text)}
                            style={{
                                fontSize: email ? 18 : 18,
                                borderBottomColor: "gray",
                                borderBottomWidth: 1,
                                marginVertical: 10,
                                width: 300,
                            }}
                            placeholderTextColor={"black"}
                            placeholder="enter Your Email"
                        />
                    </View>

                    <View style={{ marginTop: 10 }}>
                        <Text style={{ fontSize: 18, fontWeight: "600", color: "gray" }}>
                            Password
                        </Text>

                        <TextInput
                            value={password}
                            onChangeText={(text) => setPassword(text)}
                            secureTextEntry={true}
                            style={{
                                fontSize: email ? 18 : 18,
                                borderBottomColor: "gray",
                                borderBottomWidth: 1,
                                marginVertical: 10,
                                width: 300,
                            }}
                            placeholderTextColor={"black"}
                            placeholder="Passoword"
                        />
                    </View>

                    <View style={{ marginTop: 10 }}>
                        <Text style={{ fontSize: 18, fontWeight: "600", color: "gray" }}>
                            Image
                        </Text>

                        <TextInput
                            value={image}
                            onChangeText={(text) => setImage(text)}
                            style={{
                                fontSize: email ? 18 : 18,
                                borderBottomColor: "gray",
                                borderBottomWidth: 1,
                                marginVertical: 10,
                                width: 300,
                            }}
                            placeholderTextColor={"black"}
                            placeholder="Image"
                        />
                    </View>

                    <TouchableOpacity
                        onPress={handleRegister}
                        style={{
                            width: 200,
                            backgroundColor: "#4A55A2",
                            padding: 15,
                            marginTop: 50,
                            marginLeft: "auto",
                            marginRight: "auto",
                            borderRadius: 6,
                        }}
                    >
                        <Text
                            style={{
                                color: "white",
                                fontSize: 16,
                                fontWeight: "bold",
                                textAlign: "center",
                            }}
                        >
                            Register
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => props.navigation.goBack()}
                        style={{ marginTop: 15 }}
                    >
                        <Text style={{ textAlign: "center", color: "gray", fontSize: 16 }}>
                            Already Have an account? Sign in
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    )
}

export default RegisterScreen
import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import React, { FC, useState } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSelector } from 'react-redux';
import { DM_DOMAIN } from '@env';
import isEmpty from 'lodash/isEmpty';
import { saveAuthData } from '../../redux/action';

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, "Login">

const LoginScreen: FC<LoginScreenProps> = (props) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const jid = useSelector(state=> state?.chatData?.jid)

    console.log("loginscreen jid", jid);

    const handleSubmit = () => {
        console.log("chk jid", jid)
        const user = {
            email: email,
            password: password,
        }

        if(!isEmpty(email) && !isEmpty(password)){
            saveAuthData(email)
        }
    }

    return (
        <KeyboardAwareScrollView contentContainerStyle={{ flex: 1, justifyContent: 'center' }}>
            <View style={{ marginVertical: 100 }}>
                <Text style={{
                    fontSize: 30,
                    textAlign: 'center'
                }}>Sign In</Text>
                <View style={{ marginHorizontal: 24 }}>
                    <Text style={{ fontSize: 16, color: '#8e93a1' }}>NAME</Text>
                    <TextInput style={{
                        borderBottomWidth: 0.5,
                        height: 48,
                        borderBottomColor: "#8e93a1",
                        marginBottom: 30
                    }} value={email} onChangeText={text => setEmail(text)} autoCorrect={false} />
                </View>
                <View style={{ marginHorizontal: 24 }}>
                    <Text style={{ fontSize: 16, color: '#8e93a1' }}>PASSWORD</Text>
                    <TextInput style={{
                        borderBottomWidth: 0.5,
                        height: 48,
                        borderBottomColor: "#8e93a1",
                        marginBottom: 30,
                    }} value={password} onChangeText={text => setPassword(text)} secureTextEntry={true} autoComplteType="password" />
                </View>
                <TouchableOpacity onPress={handleSubmit} style={{
                    backgroundColor: "darkmagenta",
                    height: 50,
                    marginBottom: 20,
                    justifyContent: "center",
                    marginHorizontal: 15,
                    borderRadius: 15,
                }}>
                    <Text style={{
                        fontSize: 20,
                        textAlign: 'center',
                        color: '#fff',
                        textTransform: 'uppercase',
                        fontWeight: 'bold'
                    }}>Submit</Text>
                </TouchableOpacity>
                <Text style={{ fontSize: 12, textAlign: 'center' }}>
                    Not yet registered? {" "}
                    <TouchableOpacity style={{ color: 'darked', fontWeight: 'bold' }}
                        onPress={() => props.navigation.navigate("Register")}
                    >
                        <Text>Register</Text>
                    </TouchableOpacity>
                </Text>
                <Text style={{ fontSize: 12, textAlign: 'center', marginTop: 10 }}>Forgot Password?</Text>
            </View>
        </KeyboardAwareScrollView>
    )
}

export default LoginScreen
import { Text, View, Image, TextInput, TouchableOpacity } from 'react-native';
import style from "./styles";
import React from 'react';

export default function Login() {
    return (
        <View style={style.container}>

            <View style={style.boxTop}>
                <Image
                    source={require('../assets/images/logo-nexus.png')}
                    style={style.logo}
                    resizeMode="contain"
                />
            </View>

            <View style={style.boxMid}>
                <Text style={style.titleInput}>E-mail</Text>
                <View style={style.boxInput}>
                    <TextInput
                        placeholder='Ex: exemplo@email.com'
                        placeholderTextColor='#555'
                        keyboardType="email-address"
                        autoCapitalize="none"
                        style={style.input}
                    />
                </View>

                <Text style={style.titleInput}>Senha</Text>
                <View style={style.boxInput}>
                    <TextInput
                        placeholder='*******'
                        placeholderTextColor='#555'
                        secureTextEntry={true}
                        style={style.input}
                    />
                </View>
            </View>

            <View style={style.boxBottom}>
                <TouchableOpacity style={style.button}>
                    <Text style={style.buttonText}>Entrar</Text>
                </TouchableOpacity>

                <View style={style.registerContainer}>
                    <Text style={style.registerText}>Não tem uma conta? </Text>
                    <TouchableOpacity>
                        <Text style={style.registerLink}>Criar</Text>
                    </TouchableOpacity>
                </View>
            </View>

        </View>
    )
}
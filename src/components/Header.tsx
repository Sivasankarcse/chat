import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { FC } from 'react'
import { Header } from '@rneui/themed'
import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';

interface HeaderProps {
    title: string,
    image?: string,

    isIconOne?: boolean,
    isIconTwo?: boolean,
    isIconThree?: boolean,

    backAction?: () => void,
    iconOneAction?: () => void,
    iconTwoAction?: () => void,
    iconThreeAction?: () => void,

    isLeftComponent?: boolean,
    isCenterComponent?: boolean,
    isRightCompoenent?: boolean,
}

const CustomHeader: FC<HeaderProps> = (props) => {
    return (
        <View>
            <Header
                style={{ alignItems: 'center' }}
                backgroundColor='lightblue'
                leftComponent={
                    <>
                        {props.isLeftComponent && (
                            <View style={{ width: 200, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                {props.backAction && (
                                    <TouchableOpacity onPress={props.backAction} style={{ alignItems: 'center', padding: 12 }}>
                                        <Ionicons name="arrow-back" size={22} color="black" />
                                    </TouchableOpacity>
                                )}
                                {props.image && (
                                    <Image
                                        style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: 25,
                                            resizeMode: "cover",
                                            marginRight: 12
                                        }}
                                        source={{ uri: props?.image }}
                                    />
                                )}
                                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{props.title}</Text>
                            </View>
                        )
                        }
                    </>
                }
                rightComponent={
                    <>
                        {props.isRightCompoenent && (
                            <View style={{flexDirection: 'row', gap: 8}}>
                                {props.isIconOne &&
                                    <TouchableOpacity onPress={props.iconOneAction}>
                                        <Ionicons name="chatbox-ellipses-outline" size={24} color="green" />
                                    </TouchableOpacity>
                                }
                                {props.isIconTwo &&
                                    <TouchableOpacity onPress={props.iconTwoAction}>
                                        <AntDesign
                                            name="search1"
                                            size={22}
                                            color="black"
                                        />
                                    </TouchableOpacity>
                                }
                                {props.isIconThree &&
                                    <TouchableOpacity onPress={props.iconThreeAction}>
                                        <AntDesign name="logout" size={20} color="red" />
                                    </TouchableOpacity>
                                }
                            </View>
                        )}
                    </>
                }
            />
        </View>
    )
}

export default CustomHeader
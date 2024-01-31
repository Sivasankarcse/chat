import { View, Text, TouchableOpacity } from 'react-native'
import React, { FC } from 'react'
import { MaterialIcons } from '@expo/vector-icons';

type UserTileComponentProps = {
    searchUserName: string,
    navigateScreen?: (string?: string) => void;
}

const UserTileComponent: FC<UserTileComponentProps> = (props) => {
    const { searchUserName, navigateScreen } = props;
    return (
        <TouchableOpacity
            style={{ 
                padding: 10,
                borderRadius: 10,
                backgroundColor: 'lightgreen', 
                borderWidth: 1, 
                borderColor: 'red', 
                flexDirection: 'row',
                alignItems: 'center', 
                justifyContent: 'center',
                marginTop: 5
            }}
            onPress={() => navigateScreen()}
        >
            <View style={{flexDirection: 'row'}}>
                <View style={{ marginLeft: 12, flex: 1 }}>
                    <Text style={{ fontWeight: "bold" }}>{searchUserName}</Text>
                </View>

                <MaterialIcons name="message" size={20} color="black" />
            </View>
        </TouchableOpacity>

    )
}

export default UserTileComponent
export type RootStackParamList = {
    Login: undefined,
    Register: undefined,
    Home: undefined, 
    Search: undefined,
    ChatWindow: {recepientId: string, recepientName: string, recepientImage: string, newUser: boolean}
}
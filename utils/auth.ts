import { UserType } from "@/src/types"
import { SessionStorageKeysEnum } from "./Enums"
import { getData } from "./Storage"

export const getUser = (): UserType | undefined => {
    return getData(SessionStorageKeysEnum.USER_DATA)
}
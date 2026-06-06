import React from 'react'
import { SkeletonText } from "../components/ui/skeleton"

const ChatLoading = () => {
    return <SkeletonText noOfLines={20} gap="8" />
}
export default ChatLoading

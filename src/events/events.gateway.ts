import { forwardRef, Inject } from '@nestjs/common';
import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Server } from "ws";
import { UserService } from 'src/user/user.service';
import { SocialPost } from 'src/post/schema/post.schema';

@WebSocketGateway({
    cors: { origin: '*', },
})
export class EventsGateway {

    constructor(@Inject(forwardRef(() => UserService)) private userService: UserService) { }

    @WebSocketServer()
    public server: Server;

    /**
     * Join the room with given Id. All the users in this room will give the live feed of posts
     * @param client Socket client
     * @param roomId Id of room to join
     */
    @SubscribeMessage('join')
    joinNewRoom(client: Socket, roomId: string) {
        console.log(`Joined the room ${roomId}`);
        client.join(roomId)
    }

    /**
    * Remove the user with Id from room.
    * @param client Socket client
    * @param roomId Id of room to leave
    */
    @SubscribeMessage('leave')
    leaveRoom(client: Socket, roomId: string) {
        console.log(`Left the room ${roomId}`);
        client.leave(roomId)
    }

    /**
     * This method will send post to room with given Id
     * @param roomId Id of room where post will send
     * @param post Post to send
     */
    sendPostToRoom(roomId: string, post: SocialPost) {
        this.server.to(roomId).emit('updateFeed', post)
    }

    /**
     * When a user logged In it will automatically join the rooms of users he is following.
     * @param client Socket client
     * @param userId Id of user that logged In
     * @returns Error message if user does not exists
     */
    @SubscribeMessage('joinFollowedUsersRooms')
    async joinRoomsOnLogin(client: Socket, userId: string) {
        const followedUsers = await this.userService.getFollowedUsers(userId)
        if (followedUsers === false) {
            console.log(`User with id ${userId} does not exists`);
            return { message: `User with id ${userId} does not exists` }
        }
        followedUsers.map((roomId) => {
            client.join(roomId)
            console.log(`Joined the room ${roomId}`);
        })
    }
}

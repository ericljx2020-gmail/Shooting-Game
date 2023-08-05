from channels.generic.websocket import AsyncWebsocketConsumer
import json
from django.conf import settings
from django.core.cache import cache

class MultiPlayer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = None
        for i in range(1000):
            name = "room-%d" % (i)
            if not cache.has_key(name) or len(cache.get(name)) < settings.ROOM_CAPACITY:        #如果没有这个room或者当前room人数不到capacity
                self.room_name = name
                break

        if not self.room_name:
            return

        await self.accept()

        if not cache.has_key(self.room_name):
            cache.set(self.room_name, [], 3600)             #设置房间时长1小时

        for player in cache.get(self.room_name):
            await self.send(text_data=json.dumps({          #await self.sent() 向服务器发送信息
                'event':"create_player",
                'uuid':player['uuid'],
                'username':player['username'],
                'photo':player['photo'],
            }))

        await self.channel_layer.group_add(self.room_name, self.channel_name)

    async def disconnect(self, close_code):
        print('disconnect')
        await self.channel_layer.group_discard(self.room_name, self.channel_name)

    async def create_player(self, data):
        players = cache.get(self.room_name)
        players.append({
            'uuid':data['uuid'],
            'username':data['username'],
            'photo':data['photo'],
        })
        cache.set(self.room_name, players, 3600)        #对局保存1小时
        await self.channel_layer.group_send(
            self.room_name,
            {
                'type':"group_send_event",          #type指明了将这些信息发送给哪一个函数名，这里group_create_player
                'event':"create_player",
                'uuid':data['uuid'],
                'username':data['username'],
                'photo':data['photo'],
            }
        )

    async def group_send_event(self, data):
        await self.send(text_data=json.dumps(data))

    async def move_to(self, data):
        await self.channel_layer.group_send(
            self.room_name,
            {
                'type':"group_send_event",
                'event':"move_to",
                'uuid':data['uuid'],
                'tx':data['tx'],
                'ty':data['ty'],
            }
        )

    async def shoot_fireball(self, data):
        await self.channel_layer.group_send(
            self.room_name,
            {
                'type':"group_send_event",
                'event':"shoot_fireball",
                'uuid':data['uuid'],
                'tx':data['tx'],
                'ty':data['ty'],
                'ball_uuid':data['ball_uuid'],
            }
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        event = data['event']
        if event == "create_player":
            await self.create_player(data)
            #print("create_player")
        elif event == "move_to":
            await self.move_to(data)
        elif event == "shoot_fireball":
            await self.shoot_fireball(data)

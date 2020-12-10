import Dexie from 'dexie'

const db = new Dexie('incanGold')
db.version(1).stores({ uuid: 'uuid', player: 'name', game: 'room' })

const db2 = new Dexie('incanGold2')
db2.version(1).stores({ init: '++id', game: 'room', player: 'uuid' })

export { db, db2 }

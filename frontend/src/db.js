import Dexie from 'dexie'

const db = new Dexie('incanGold')
db.version(1).stores({ uuid: 'uuid', player: 'name', game: 'room' })

export default db

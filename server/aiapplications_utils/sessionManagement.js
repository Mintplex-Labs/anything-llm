const { ConversationalSearchServiceClient } = require('@google-cloud/discoveryengine').v1;
const { project_id, location, engine_ids } = require('./config');
const fs = require('fs').promises;
const path = require('path');

const dbPath = path.join(__dirname, 'db.json');

const client = new ConversationalSearchServiceClient({
    apiEndpoint: `${location}-discoveryengine.googleapis.com`,
});

async function createSession(engine_id, user_pseudo_id) {
    const session = await client.createSession({
        parent: `projects/${project_id}/locations/${location}/collections/default_collection/engines/${engine_id}`,
        session: { userPseudoId: user_pseudo_id },
    });
    return session[0].name;
}

async function createSessionForEngines(user_pseudo_id) {
    const sessionPromises = engine_ids.map(async (engine_id) => {
        const session_id = await createSession(engine_id, user_pseudo_id);
        const session_number = session_id.split("/").pop();
        return [engine_id, session_number];
    });
    const sessionPairs = await Promise.all(sessionPromises);
    return Object.fromEntries(sessionPairs);
}

async function deleteSession(sessionName) {
    await client.deleteSession({ name: sessionName });
    console.log(`Session ${sessionName} deleted.`);
}

async function deleteSessionsForUser(user_pseudo_id) {
    const session_ids = await retrieveSessionIds(user_pseudo_id);
    if (session_ids) {
        for (const engine_id in session_ids) {
            await deleteSession(session_ids[engine_id]);
        }
        const all_data = JSON.parse(await fs.readFile(dbPath, 'utf8'));
        delete all_data[user_pseudo_id];
        await fs.writeFile(dbPath, JSON.stringify(all_data, null, 2));
    }
}

async function save_session_ids(user_pseudo_id, engines_session_ids) {
    const all_data = JSON.parse(await fs.readFile(dbPath, 'utf8'));
    all_data[user_pseudo_id] = engines_session_ids;
    await fs.writeFile(dbPath, JSON.stringify(all_data, null, 2));
}

async function retrieveSessionIds(user_pseudo_id) {
    const all_data = JSON.parse(await fs.readFile(dbPath, 'utf8'));
    return all_data[user_pseudo_id] || null;
}

module.exports = {
    createSessionForEngines,
    retrieveSessionIds,
    deleteSessionsForUser
}; 
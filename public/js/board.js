const viewAddTaskModal = state => state.modal ? `
    <main id="modal" onclick="app.run('hideModal')">
        <form onclick="event.stopPropagation();" onsubmit="event.stopPropagation();app.run('addTask', this);return false;">
            <textarea class="textarea" name="desc" placeholder="Add your task" required row="5"></textarea>
            <label>assign user:</label>
            <select name="user">
                ${state.users.map(user => {
                    return `<option value="${user.id}">${user.name}</option>`
                }).join("")}
            </select>
            <button>Add Task</button>
        </form>
    </main>
` : ""

const viewUserPill = User => `
    <article class="user-pill">
        <img src="${User.avatar || '/avatars/default.jpg'}" alt="${User.name || 'unknown'}"/>
        <span>${User.name ? User.name.substring(0,11) : 'user not assigned'}</span>
    </article>
`

const viewTask = task => `
    <article id="${task.id}" class="task" draggable="true" ondragstart="app.run('ondragstart', event);">
        <p>${task.desc}</p>
        ${viewUserPill(task.User || {})}
    </article>
`

const view = state => `
    <h1><a href="/">🔙</a>&nbsp;${state.board.title}</h1>
    <section>
        <aside id="0" ondragover="event.preventDefault()" ondrop="app.run('ondrop', event)">
            <h2>todo</h2>
            ${state.board.Tasks
            .filter(task => task.status === 0)
            .map(viewTask).join("")}
            <button onclick="app.run('showModal')">Add Task</button>
        </aside>
        <aside id="1" ondragover="event.preventDefault()" ondrop="app.run('ondrop', event)">
            <h2>doing</h2>
            ${state.board.Tasks
                .filter(task => task.status === 1)
                .map(viewTask).join("")}
        </aside>
        <aside id="2" ondragover="event.preventDefault()" ondrop="app.run('ondrop', event)">
            <h2>done</h2>
            ${state.board.Tasks
                .filter(task => task.status === 2)
                .map(viewTask).join("")}
        </aside>
    </section>
    ${viewAddTaskModal(state)}
`
const update = {
    ondragstart: (state, event) => {        
        event.dataTransfer.setData('text', event.target.id)
        return state
    },
    ondrop: async (state, event) => {
        const task = state.board.Tasks.find(task => String(task.id) === event.dataTransfer.getData('text'))
        task.status = Number(event.target.id)
        fetch(`/boards/${state.board.id}/tasks/${task.id}/update/${task.status}`)
        return state
    },
    hideModal: state => {
        state.modal = false
        return state
    },
    showModal: state => {
        state.modal = true
        return state
    },
    addTask: async (state, form) => {
        const data = new FormData(form)
        const desc = data.get('desc')
        const UserId = data.get('user')
        const task = await fetch(`/boards/${state.board.id}/tasks`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({desc, status: 0, UserId, BoardId: state.board.id})
        })
        .then(res => res.json())
        state.board.Tasks.push(task)
        state.modal = false
        return state
    }
}

app.start('board', state, view, update)
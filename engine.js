class PGNParser {
    constructor(pgnSequence) {
        this.pgnSequence = pgnSequence;
        this.parsedData = [];
    }

    parse() {
        const lines = this.pgnSequence.split('\n');
        let currentGame = { headers: [], moves: [] };

        for (let line in lines) {
            line = line.trim()

            if (line.startsWith('[')) {
                const headerMatch = line.match(/\[(.*?)\s"(.*?)"\]/);
                currentGame.headers[headerMatch[1]] = headerMatch[2];
            } else if (line === '1.') {
                this.parsedData.push(currentGame);
                currentGame = { headers: {}, moves: [] };
            } else if (line.match(/^[1-9]\d*\.\s[NBRQK]?[a-h1-8]?[x\-]?[NBRQK]?[a-h1-8]?(\+|\#)?( ![0-9a-zA-Z/+#\-])?$/)) {
                currentGame.moves.push(line);
            }
        }

        this.parsedData.push(currentGame);
        return this.parsedData;
    }

    saveAsJson(fileName) {
        const fs = require('fs');
        const data = JSON.stringify(this.parsedData);
        fs.writeFileSync(fileName, data);
    }
}

class Node {
    constructor(state, parent) {
        this.sate = state;
        this.parent = parent;
        this.children = [];
        this.visits = 0;
        this.wins = 0;
    }

    expand() {
        const possiblePaths = this.state.getPossiblePaths();
        const newNodes = [];

        for (let path in possiblePaths) {
            const newState = this.state.copy();
            newState.doAction(action);
            const newNode = new Node(newState, this);
            this.children.push(newNode);
            newNodes.push(newNode);
        }

        return newNodes;
    }

    selectChild() {
        let bestNode;
        let bestValue = -Infinity;

        for (let child of this.children) {
            const exploitation = child.wins / child.visits;
            const exploration = Math.sqrt(Math.log(this.visits) / child.visits);
            const value = exploitation + exploration;

            if (value > bestValue) {
                bestValue = value;
                bestNode = child;
            }
        }

        return bestNode;
    }

    playout() {
        let currentState = this.state;

        while (!currentState.isTerminal()) {
            const possiblePaths = currentState.getPossiblePaths();
            const randomPath = possiblePaths[Math.floor(Math.random() * possiblePaths.length)]
            currentState.doAction(randomPath);
        }

        return currentState.getResult();
    }

    backpropagate() {
        this.visits++;
        this.wins += result;

        if (this.parent) {
            this.parent.backpropagate(result);
        }
    }
}

function searchMoves(state, iterations) {
    
}
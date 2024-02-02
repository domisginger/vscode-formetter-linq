import * as vscode from 'vscode';

function expandLinq(inputString: string): string {
  let outputString = '';
  let indentation = 0;

  for (let i = 0; i < inputString.length; i++) {
    let char = inputString[i];
        
    if (char === '(') {
      outputString += char + '\n' + ' '.repeat((indentation + 1) * 4);    
      indentation++;      

    } else if ((char === '&' && inputString[i + 1] === '&') || (char === '|' && inputString[i + 1] === '|')) {
      char = char + char;
      i++;
      outputString += '\n' + ' '.repeat((indentation) * 4) + char;
      
    } else if (char === ')') {      
      indentation = Math.max(0, indentation - 1);    
      outputString += '\n' + ' '.repeat(indentation * 4) + char;

    } else {
      outputString += char;
    }
  }

  return outputString;
}

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.languages.registerDocumentFormattingEditProvider('LINQ', {
        provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
            const selectedText = document.getText();
            const formattedText = expandLinq(selectedText);            
			      return [vscode.TextEdit.replace(new vscode.Range(new vscode.Position(0,0), new vscode.Position(document.lineCount + 1, 0)), formattedText)];
        }
    });

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}

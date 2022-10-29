#include <stdio.h>
#include <tchar.h>
#include <windows.h>
#include "string.h"
#include <iostream>
#include <fstream>

using namespace std;

string GetExePath (void) {  
    char szFilePath[MAX_PATH + 1] = {0};  
    GetModuleFileNameA(NULL, szFilePath, MAX_PATH); (strrchr(szFilePath, '\\'))[0] = 0;
    string path = szFilePath;  
  
    return path;  
}

int main (int argc, char* argv[]) {
	
	SetConsoleOutputCP(65001);
	
	string exePath = GetExePath();
    cout << exePath << endl;
	
	printf("%d\n", argc);
    //cout << argv[0] << endl;
    //cout << argv[1] << endl;
	
	//if (argc < 2) return 0;
	string cmd;
	//cmd.append(exePath);
	//cmd.append("node ");

    ifstream config_ifstream;
    config_ifstream.open("config.txt");
    getline(config_ifstream, cmd);

    config_ifstream.close();
    cout << cmd;
    
    //return 0;

	STARTUPINFO StartInfo = {sizeof(StartInfo)};
	PROCESS_INFORMATION ProcInfo;
	StartInfo.dwFlags = STARTF_USESHOWWINDOW;
	StartInfo.wShowWindow = false;

    //PROCESS_INFORMATION ProcInfo;
    
    cout << TEXT((LPSTR)cmd.c_str()) << endl;

	CreateProcess(NULL, TEXT((LPSTR)cmd.c_str()), NULL, NULL,
        false, 0, NULL, NULL, &StartInfo, &ProcInfo);

	return 0;
}

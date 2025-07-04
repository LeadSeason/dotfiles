#include <fstream>
#include <iostream>
#include <algorithm>

int main(int argc, char** argv)
{
	std::ifstream ifs("/tmp/updates");
	std::string updates( (std::istreambuf_iterator<char>(ifs) ),
						 (std::istreambuf_iterator<char>()    ));

	size_t updatesLen = 0;
	size_t start_pos = 0;
	while((start_pos = updates.find("\n", start_pos)) != std::string::npos)
	{
		updates.replace(start_pos, 1, "\\n");
		start_pos += 2;
		updatesLen++;
	}

	if (updates.length() > 1)
	{
		// Remove last \n from the file
		updates.pop_back();
		updates.pop_back();
	}

	std::cout << "{\"text\": \"" << updatesLen << "\", \"alt\": \"none\", \"tooltip\": \"" << updates << "\", \"class\": \"none\"}\n";
	return 0;
}

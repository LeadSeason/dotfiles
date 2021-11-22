function fish_command_not_found
	
    if pacman -Ss $argv[1]
		set fish_installables (pacman -Ss $argv[1])
		set fish_installable (echo $fish_installables | cut -d " " -f 1 | cut -d "/" -f 2 | grep -m1 "")
		set fish_installable_promt (echo "Do you want to Install $fish_installable? [y/N] ")
		echo
    	read -l -P $fish_installable_promt confirm
	    switch $confirm
    		case Y y
				sudo pacman -S $fish_installable
     		case '' N n
        		return 0 
		end
    else
        __fish_default_command_not_found_handler
    end
end


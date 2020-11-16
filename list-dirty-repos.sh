#!/bin/bash

for folder in $@
do
	find $folder -name .git -type d -maxdepth 2 | while IFS= read -r repo
	do
		repo="${repo/\/.git/}"

		status=`git -C "$repo" status -s`

		if [[ -n $status ]]
		then
			printf "${repo/`echo ~`/~}\n"

			echo "$status" | while IFS= read -r line
			do
				printf "\t$line\n"
			done

			printf "\n"
		fi
	done
done

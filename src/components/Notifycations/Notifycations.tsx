import { Box, Menu, MenuItem, Typography } from "@mui/material";
import { format } from "date-fns";
import { memo, useMemo } from "react";
import { useInfiniteQuery } from "react-query";
import { Link } from "react-router-dom";
import borders from "../../assets/theme/base/borders";
import colors from "../../assets/theme/base/colors";
import { PagingResponse } from "../../types/axios/paging";
import { axiosInstance } from "../../api/instance";
import { useNotify } from "../../context/notify";

type NotifyType = {
	id: string;
	// type: string;
	content: string;
	note: string;
	createdDate: string;
	avatar: string;
};
// ({ notify, isNew }: { notify: NotifyType; isNew: boolean })
// ({ notify }: { notify: NotifyType })
const NotificationItem = ({ notify, isNew }: { notify: NotifyType; isNew: boolean }) => {
	const { removeNoti } = useNotify();
	return (
		<MenuItem
			sx={({ transitions }) => ({
				display: "flex",
				alignItems: "center",
				// overflow: "hidden",
				// whiteSpace: "normal",
				width: "100%",
				color: colors.dark.main,
				borderRadius: borders.borderRadius.md,
				backgroundColor: isNew ? "#e7faff" : colors.white.main,
				transition: transitions.create("background-color", {
					easing: transitions.easing.easeInOut,
					duration: transitions.duration.standard
				}),

				"& *": {
					transition: "color 100ms linear"
				},

				"&:not(:last-child)": {
					mb: 1
				},

				"&:hover": {
					backgroundColor: colors.light.main,

					"& *": {
						color: colors.dark.main
					}
				}
			})}
		>
			<img
				style={{ borderRadius: "50%", width: 40, height: 40, objectFit: "cover", marginRight: 10 }}
				// src="https://img.hoidap247.com/picture/question/20201128/large_1606564899875.jpg"
				src={notify.avatar}
			/>
			<Box
				component={Link}
				display="flex"
				flexDirection="column"
				lineHeight={1}
				sx={{ textDecoration: "none" }}
				onClick={() => {
					if (removeNoti) removeNoti(notify.id);
				}}
			>
				<Typography fontWeight="regular" color={colors.dark.main} sx={{ fontSize: 14 }}>
					{notify.content}
				</Typography>
				<Typography align="left" sx={{ fontSize: 10 }} color={colors.text.main}>
					{format(Date.parse(notify.createdDate), "hh:mm dd:MM:yyyy")}
				</Typography>
			</Box>
		</MenuItem>
	);
};

const Notifys = ({
	openMenu,
	close
}: {
	openMenu: (EventTarget & HTMLButtonElement) | undefined;
	close: () => void;
}) => {
	const { newNoti } = useNotify();
	const { data } = useInfiniteQuery<PagingResponse<NotifyType>, unknown, PagingResponse<NotifyType>>(
		["all-notifys"],
		async ({ pageParam = 1 }) => {
			return (
				await axiosInstance.get<PagingResponse<NotifyType>>("notifications", {
					params: {
						IsDescending: true,
						pageIndex: pageParam
					}
				})
			).data;
		},
		{
			getNextPageParam: lastPage => lastPage.meta.pageIndex + 1
		}
	);
	const notifys = useMemo(() => {
		if (!data?.pages) return [];
		const newData = data?.pages.flatMap(data => data.data);
		return newData;
	}, [data]);

	return (
		<Menu
			anchorEl={openMenu}
			anchorOrigin={{
				vertical: "bottom",
				horizontal: "left"
			}}
			open={Boolean(openMenu)}
			onClose={close}
			sx={{ mt: 2, maxHeight: 500, maxWidth: 500 }}
		>
			{notifys.map(
				i => (
					console.log(i.id in newNoti), (<NotificationItem isNew={i.id in newNoti} notify={i} key={i.id} />)
				)
			)}
		</Menu>
	);
};

export default memo(Notifys);

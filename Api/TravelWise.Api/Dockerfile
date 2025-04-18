﻿FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["TravelWise.Api/TravelWise.Api.csproj", "TravelWise.Api/"]
COPY ["TravelWise.Domain/TravelWise.Domain.csproj", "TravelWise.Domain/"]
COPY ["TravelWise.Model/TravelWise.Model.csproj", "TravelWise.Model/"]
COPY ["TravelWise.Bl/TravelWise.Bl.csproj", "TravelWise.Bl/"]
RUN dotnet restore "TravelWise.Api/TravelWise.Api.csproj"
COPY . .
WORKDIR "/src/TravelWise.Api"
RUN dotnet build "TravelWise.Api.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "TravelWise.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "TravelWise.Api.dll"]

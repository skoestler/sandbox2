{
    description = "A simple distributed development environment built around NATS and etcd";
    inputs = {
        nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    };
    outputs = { self, nixpkgs }:
    let
        system = "aarch64-darwin"; # Adjust to "x86_64-linux" or "aarch64-linux" as needed
        pkgs = import nixpkgs { inherit system; config.allowUnfree = true; };
    in {
        devShells.${system}.default = pkgs.mkShell {
            packages = [
              pkgs.bun
              pkgs.etcd
              pkgs.nats-server
              pkgs.natscli
              pkgs.postgresql
              pkgs.process-compose
              pkgs.httpie
            ];

            shellHook = ''
                export PGHOST=$PWD/data/postgres/locks
                export ETCD_DATA_DIR=$PWD/data/etcd
            '';
        };
    };
}

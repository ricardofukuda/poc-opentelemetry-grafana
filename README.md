# POC - OpenTelemetry with Grafana
## Install Helm charts
helm repo add grafana https://grafana.github.io/helm-charts

### Grafana Tempo Distributed
kubectl create namespace tempo-distributed\
helm upgrade --install tempo-distributed grafana/tempo-distributed -n tempo-distributed --version 0.25.0 -f tempo-distributed/values.yaml

### Grafana Dashboard
kubectl create namespace grafana\
helm upgrade --install grafana grafana/grafana -n grafana --version 6.33.1 -f grafana/values.yaml\
OBS: Access the grafana dashboard usaing http://grafana.local

### OpenTelemetry Collector
kubectl create namespace opentelemetry\
helm repo add open-telemetry https://open-telemetry.github.io/opentelemetry-helm-charts\
helm upgrade opentelemetry-collector --install -n opentelemetry --version 0.28.0 -f otlp-collector/values.yaml open-telemetry/opentelemetry-collector

### Prometheus
Required to store APM metrics generated by Tempo Metrics Generator.\
You must enable the prometheus remote write feature "--web.enable-remote-write-receiver" to allow Metrics Generator save the metrics.\
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts\
kubectl create namespace prometheus\
helm upgrade --install prometheus -n prometheus --version 15.12.0 -f prometheus/values.yaml  prometheus-community/prometheus

## Configuration
### Grafana
1 - Create a new Tempo datasource with the configuration below:\
url: http://tempo-distributed-query-frontend.tempo-distributed:3100

### Aplications
The applications should forward the traces to the opentelemetry-collector service ports 4318(http) or 4317(grpc).\
Use the port-forward below to connect your application:\
kubectl port-forward service/opentelemetry-collector -n opentelemetry 4318:4318\
kubectl port-forward service/tempo-distributed-query-frontend -n tempo-distributed 3100:3100

## Additional links
Tempo Metrics Generator to generate statistics about the traces/spans:\
https://grafana.com/blog/2022/05/02/new-in-grafana-tempo-1.4-introducing-the-metrics-generator/\
https://grafana.com/docs/tempo/v1.5.x/metrics-generator/?pg=blog&plcmt=body-txt